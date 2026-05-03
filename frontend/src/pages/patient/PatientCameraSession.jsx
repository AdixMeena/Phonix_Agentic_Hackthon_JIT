// PatientCameraSession.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import PatientApprovalGate from '../../components/PatientApprovalGate.jsx'
import { supabase } from '../../lib/supabase.js'

export default function PatientCameraSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [exerciseName, setExerciseName] = useState('Exercise')
  const [visionModel, setVisionModel] = useState(location.state?.vision_model || 'general')
  const [feedback, setFeedback] = useState('Initializing...')
  const [reps, setReps] = useState(0)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzingMsg, setAnalyzingMsg] = useState('')

  // ── NEW: language toggle state — 'en' = English, 'ur' = Urdu ─────────────
  const [voiceLang, setVoiceLang] = useState('en')
  const [wsStatus, setWsStatus] = useState('connecting')
  const [backendFrameReady, setBackendFrameReady] = useState(false)


  const videoRef = useRef(null)
  const displayCanvasRef = useRef(null)
  const captureRef = useRef(null)
  const wsRef = useRef(null)
  const sendTimerRef = useRef(null)
  const sessionIdRef = useRef(`${Date.now()}`)
  const jointScoresRef = useRef({})
  const scoreRef = useRef(100) // Default to 100
  const repsRef = useRef(0)
  const timerRef = useRef(0)
  const formTallyRef = useRef({ good: 0, total: 0 })

  // Keep voiceLang accessible inside WS callback without re-registering the effect
  const voiceLangRef = useRef(voiceLang)
  useEffect(() => { voiceLangRef.current = voiceLang }, [voiceLang])

  // Keep score/reps/timer refs in sync
  useEffect(() => { scoreRef.current = score }, [score])
  useEffect(() => { repsRef.current = reps }, [reps])
  useEffect(() => { timerRef.current = timer }, [timer])

  // Load exercise metadata (fallback if route state is missing)
  useEffect(() => {
    let isMounted = true
    async function loadExercise() {
      const { data } = await supabase
        .from('exercises')
        .select('name, vision_model')
        .eq('id', Number(id))
        .maybeSingle()
      if (!isMounted || !data) return
      if (location.state?.exercise_name) {
        setExerciseName(location.state.exercise_name)
      } else if (data.name) {
        setExerciseName(data.name)
      }
      if (!location.state?.vision_model) {
        setVisionModel(data.vision_model || 'general')
      }
    }
    loadExercise()
    return () => { isMounted = false }
  }, [id, location.state])

  // Session timer
  useEffect(() => {
    const t = setInterval(() => setTimer(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Camera init
  useEffect(() => {
    let isMounted = true
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (!isMounted) return
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch {
        setFeedback('Camera access denied')
      }
    }
    initCamera()
    return () => {
      isMounted = false
      const stream = videoRef.current?.srcObject
      if (stream?.getTracks) stream.getTracks().forEach(t => t.stop())
    }
  }, [])

  // Vision backend websocket
  useEffect(() => {
    if (!visionModel || exerciseName === 'Exercise') return

    const wsUrl = import.meta.env.VITE_VISION_WS_URL || 'ws://localhost:8765'
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setWsStatus('open')
      ws.send(JSON.stringify({
        action: 'start',
        exercise: exerciseName,
        language: voiceLangRef.current === 'ur' ? 'ur' : 'en',
        audiobot: 'on',
      }))
      setFeedback('Position yourself in front of the camera')
    }

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data)

        const frameBase64 = data.frame || data.data
        if (frameBase64) {
          setBackendFrameReady(true)
          const img = new Image()
          img.onload = () => {
            const canvas = displayCanvasRef.current
            if (!canvas) return
            const ctx = canvas.getContext('2d')
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
          }
          img.src = `data:image/jpeg;base64,${frameBase64}`
        }

        const backendReps = typeof data.rep_count === 'number' ? data.rep_count : data.reps
        if (typeof backendReps === 'number') {
          setReps(backendReps)
          repsRef.current = backendReps
        }

        // Calculate accurate form score based on feedback tally rather than instant ML confidence
        const feedbackMsg = data.feedback || data.error_text || data.prediction
        if (feedbackMsg && feedbackMsg !== "Initializing..." && feedbackMsg !== "Collecting data...") {
          formTallyRef.current.total += 1
          
          const isGood = feedbackMsg.toLowerCase().includes("good") || 
                         feedbackMsg.toLowerCase().includes("doing well") || 
                         feedbackMsg.toLowerCase().includes("great form") || 
                         feedbackMsg.toLowerCase().includes("correct") ||
                         feedbackMsg.toLowerCase() === "perfect"

          if (isGood) {
            formTallyRef.current.good += 1
          }

          // Start updating score after collecting a few frames
          if (formTallyRef.current.total > 5) {
            const calculatedScore = Math.round((formTallyRef.current.good / formTallyRef.current.total) * 100)
            setScore(calculatedScore)
            scoreRef.current = calculatedScore
          }
        }

        if (data.feedback || data.error_text) {
          setFeedback(data.feedback || data.error_text)
        }

        if (data.joint_scores && typeof data.joint_scores === 'object') {
          jointScoresRef.current = data.joint_scores
        }

        const audioB64 = data.audio || data.audio_data
        if (audioB64) {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(audioB64), c => c.charCodeAt(0))],
            { type: 'audio/mpeg' },
          )
          const url = URL.createObjectURL(audioBlob)
          const audio = new Audio(url)
          audio.play().catch(() => {})
          audio.onended = () => URL.revokeObjectURL(url)
        }

      } catch {
        // ignore parse errors
      }
    }

    ws.onclose = () => {
      setWsStatus('closed')
      setBackendFrameReady(false)
      setFeedback('Session ended')
    }
    ws.onerror = () => {
      setWsStatus('error')
      setBackendFrameReady(false)
      setFeedback('Could not connect to vision server')
    }

    return () => ws.close()
  }, [visionModel, exerciseName])

  // Frame capture loop
  useEffect(() => {
    if (!visionModel) return

    const capture = () => {
      const video = videoRef.current
      const canvas = captureRef.current
      const ws = wsRef.current
      if (!video || !canvas || !ws || ws.readyState !== WebSocket.OPEN) return
      if (video.videoWidth === 0 || video.videoHeight === 0) return

      const MAX_WIDTH = 640
      let w = video.videoWidth
      let h = video.videoHeight
      if (w > MAX_WIDTH) {
        h = Math.floor(h * (MAX_WIDTH / w))
        w = MAX_WIDTH
      }

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }

      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, w, h)
      const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1]
      ws.send(JSON.stringify({ frame: base64 }))
    }

    sendTimerRef.current = setInterval(capture, 150)
    return () => clearInterval(sendTimerRef.current)
  }, [visionModel])

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleLangToggle = () => {
    const newLang = voiceLang === 'en' ? 'ur' : 'en'
    setVoiceLang(newLang)
    voiceLangRef.current = newLang
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'language',
        language: newLang,
      }))
    }
  }

  // ── Stop handler ──────────────────────────────────────────────────────────
  async function handleStop() {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'stop' }))
      wsRef.current.close()
    }
    clearInterval(sendTimerRef.current)

    setAnalyzing(true)

    const finalScore = scoreRef.current
    const finalReps = repsRef.current
    const finalDuration = timerRef.current

    const jointScoresArray = Object.entries(jointScoresRef.current).map(([name, sc]) => ({
      name,
      score: typeof sc === 'number' ? sc : 0,
      status: typeof sc === 'number' && sc >= 70 ? 'good' : 'warning',
    }))

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    let patientId = 'unknown'
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) patientId = user.id
    } catch { /* continue */ }

    setAnalyzingMsg('Saving session...')
    let sessionId = null
    try {
      const res = await fetch(`${apiBase}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          exercise_id: Number(id),
          score: Math.round(finalScore),
          reps: finalReps,
          duration: finalDuration,
          joint_scores: jointScoresArray,
        }),
      })
      const saved = await res.json()
      sessionId = saved.session_id || null
    } catch { /* continue */ }

    setAnalyzingMsg('Analyzing your performance...')
    let analysis = null
    if (sessionId) {
      try {
        const res = await fetch(`${apiBase}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            patient_id: patientId,
            exercise_id: Number(id),
          }),
        })
        analysis = await res.json()
      } catch { /* continue */ }
    }

    navigate('/patient/score', {
      state: {
        exerciseId: id,
        reps: finalReps,
        score: Math.round(finalScore),
        duration: finalDuration,
        jointScores: jointScoresArray,
        analysis,
      },
    })
  }

  // ── Analyzing overlay ─────────────────────────────────────────────────────
  if (analyzing) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Inter", sans-serif', gap: 24,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '3px solid #272729',
          borderTop: '3px solid #0071e3',
          animation: 'spin 0.9s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 19, fontWeight: 600, color: '#fff' }}>{analyzingMsg}</div>
        <div style={{ fontSize: 14, color: '#6e6e73' }}>Please wait a moment</div>
      </div>
    )
  }

  // Always show vision session now

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <PatientApprovalGate showNav={false}>
      <div style={{
        position: 'fixed', inset: 0,
        background: '#000', overflow: 'hidden',
        fontFamily: '"Inter", sans-serif',
      }}>
        <video
          ref={videoRef}
          style={{ 
            position: 'absolute', inset: 0, 
            width: '100%', height: '100%', 
            objectFit: 'cover',
            opacity: backendFrameReady ? 0 : 1,
            zIndex: backendFrameReady ? -1 : 1,
          }}
          playsInline muted autoPlay
        />
        <canvas
          ref={displayCanvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: backendFrameReady ? 'block' : 'none',
          }}
        />
        <canvas ref={captureRef} style={{ display: 'none' }} />

        {/* ── Top bar ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.70)',
          padding: '48px 20px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{exerciseName}</div>
          <div style={{ fontSize: 17, color: '#fff', fontWeight: 600, textAlign: 'center', flex: 1, padding: '0 16px' }}>
            {feedback}
          </div>
          <div style={{ fontSize: 14, color: '#6e6e73', minWidth: 50, textAlign: 'right' }}>{fmt(timer)}</div>
        </div>

        {/* ── NEW: Language toggle pill (top-left, below top bar) ── */}
        {/* Tap to switch between English and Urdu voice feedback     */}
        <div style={{
          position: 'absolute', top: 110, left: 16,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {/* Toggle track */}
          <button
            onClick={handleLangToggle}
            title="Switch voice language"
            style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(39,39,41,0.88)',
              border: 'none', borderRadius: 999,
              padding: '4px 6px', cursor: 'pointer', gap: 6,
            }}
          >
            {/* EN label */}
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
              background: voiceLang === 'en' ? '#0071e3' : 'transparent',
              color: voiceLang === 'en' ? '#fff' : '#6e6e73',
              transition: 'background 0.2s, color 0.2s',
            }}>
              EN
            </span>
            {/* UR label */}
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
              background: voiceLang === 'ur' ? '#0071e3' : 'transparent',
              color: voiceLang === 'ur' ? '#fff' : '#6e6e73',
              transition: 'background 0.2s, color 0.2s',
            }}>
              اردو
            </span>
          </button>
          {/* Small mic icon to hint it's about voice */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#6e6e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>

        {/* ── Right score card ── */}
        <div style={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(39,39,41,0.88)', borderRadius: 12,
          padding: '14px 12px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          minWidth: 70,
        }}>
          <div style={{ fontSize: 12, color: '#6e6e73' }}>Score</div>
          <div style={{
            fontSize: 32, fontWeight: 600,
            color: score >= 75 ? '#34c759' : score >= 50 ? '#ff9f0a' : '#ff3b30',
          }}>
            {Math.round(score)}
          </div>
          <div style={{ width: 3, height: 80, background: 'rgba(255,255,255,0.1)', borderRadius: 2, position: 'relative' }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: `${score}%`, background: '#0071e3', borderRadius: 2,
              transition: 'height 0.5s ease',
            }} />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.70)',
          padding: '20px 32px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#6e6e73' }}>Reps</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>{reps}</div>
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#272729', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <button
            onClick={handleStop}
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#ff3b30', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: 16, height: 16, background: '#fff', borderRadius: 3 }} />
          </button>
        </div>
      </div>
    </PatientApprovalGate>
  )
}