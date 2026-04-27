import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { exercises } from '../../data.js'

// Simulated skeleton keypoints
const JOINTS = [
  { id: 'head', x: 50, y: 12, connected: ['neck'] },
  { id: 'neck', x: 50, y: 22, connected: ['lShoulder', 'rShoulder', 'spine'] },
  { id: 'lShoulder', x: 35, y: 32, connected: ['lElbow'] },
  { id: 'rShoulder', x: 65, y: 32, connected: ['rElbow'] },
  { id: 'lElbow', x: 28, y: 47, connected: ['lWrist'] },
  { id: 'rElbow', x: 72, y: 47, connected: ['rWrist'] },
  { id: 'lWrist', x: 24, y: 60, connected: [] },
  { id: 'rWrist', x: 76, y: 60, connected: [] },
  { id: 'spine', x: 50, y: 42, connected: ['lHip', 'rHip'] },
  { id: 'lHip', x: 41, y: 58, connected: ['lKnee'] },
  { id: 'rHip', x: 59, y: 58, connected: ['rKnee'] },
  { id: 'lKnee', x: 39, y: 73, connected: ['lAnkle'] },
  { id: 'rKnee', x: 61, y: 73, connected: ['rAnkle'] },
  { id: 'lAnkle', x: 38, y: 88, connected: [] },
  { id: 'rAnkle', x: 62, y: 88, connected: [] },
]

const GOOD_JOINTS = new Set(['head', 'neck', 'lShoulder', 'rShoulder', 'spine', 'lHip', 'rHip', 'lKnee', 'rKnee'])
const BAD_JOINTS = new Set(['lElbow', 'lAnkle'])

const FEEDBACK_MSGS = [
  "Hold the position steady",
  "Bend your knee a little more",
  "Great angle — keep it up",
  "Straighten your back slightly",
  "Perfect form!",
  "Lower your shoulder",
]

export default function PatientCameraSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const exercise = exercises.find(e => e.id === Number(id))

  const [reps, setReps] = useState(0)
  const [score, setScore] = useState(72)
  const [timer, setTimer] = useState(0)
  const [feedbackIdx, setFeedbackIdx] = useState(0)
  const [jitter, setJitter] = useState({})
  const svgRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => {
      setTimer(s => s + 1)
      if (Math.random() > 0.7) setReps(r => r + 1)
      setScore(s => Math.max(50, Math.min(99, s + (Math.random() - 0.4) * 4)))
      setFeedbackIdx(i => (i + 1) % FEEDBACK_MSGS.length)

      // Animate skeleton jitter
      const j = {}
      JOINTS.forEach(joint => {
        j[joint.id] = { dx: (Math.random() - 0.5) * 1.5, dy: (Math.random() - 0.5) * 1.5 }
      })
      setJitter(j)
    }, 1800)
    return () => clearInterval(t)
  }, [])

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  function getJointPos(joint) {
    const j = jitter[joint.id] || { dx: 0, dy: 0 }
    return {
      cx: `${joint.x + j.dx}%`,
      cy: `${joint.y + j.dy}%`,
      x: joint.x + j.dx,
      y: joint.y + j.dy,
    }
  }

  function handleStop() {
    navigate('/patient/score', { state: { exerciseId: id, reps, score: Math.round(score), duration: timer } })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000', overflow: 'hidden',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Simulated camera feed */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a0a0f 0%, #0d1520 50%, #0a0a0f 100%)',
      }}>
        {/* Grid overlay to simulate depth */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="white" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="white" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      {/* Skeleton SVG overlay */}
      <svg
        ref={svgRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connection lines */}
        {JOINTS.map(joint => {
          const pos = getJointPos(joint)
          return joint.connected.map(targetId => {
            const target = JOINTS.find(j => j.id === targetId)
            if (!target) return null
            const tpos = getJointPos(target)
            return (
              <line
                key={`${joint.id}-${targetId}`}
                x1={`${pos.x}%`} y1={`${pos.y}%`}
                x2={`${tpos.x}%`} y2={`${tpos.y}%`}
                stroke="rgba(255,255,255,0.6)" strokeWidth="0.4"
                strokeLinecap="round"
              />
            )
          })
        })}

        {/* Landmark dots */}
        {JOINTS.map(joint => {
          const pos = getJointPos(joint)
          const isGood = GOOD_JOINTS.has(joint.id)
          const isBad = BAD_JOINTS.has(joint.id)
          const color = isBad ? '#ff3b30' : isGood ? '#34c759' : '#ff9f0a'
          return (
            <g key={joint.id}>
              <circle cx={`${pos.x}%`} cy={`${pos.y}%`} r="0.8" fill={color} opacity="0.3" />
              <circle cx={`${pos.x}%`} cy={`${pos.y}%`} r="0.5" fill={color} />
            </g>
          )
        })}
      </svg>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.70)',
        padding: '48px 20px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>
          {exercise?.name || 'Exercise'}
        </div>
        <div style={{ fontSize: 17, color: '#fff', fontWeight: 600, textAlign: 'center', flex: 1, padding: '0 16px' }}>
          {FEEDBACK_MSGS[feedbackIdx]}
        </div>
        <div style={{ fontSize: 14, color: '#6e6e73', minWidth: 50, textAlign: 'right' }}>
          {fmt(timer)}
        </div>
      </div>

      {/* Right floating score card */}
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
        {/* Vertical progress bar */}
        <div style={{ width: 3, height: 80, background: 'rgba(255,255,255,0.1)', borderRadius: 2, position: 'relative' }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: `${score}%`, background: '#0071e3', borderRadius: 2,
            transition: 'height 0.5s ease',
          }} />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.70)',
        padding: '20px 32px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Reps */}
        <div>
          <div style={{ fontSize: 12, color: '#6e6e73' }}>Reps</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>{reps}</div>
        </div>

        {/* Camera flip */}
        <button style={{
          width: 44, height: 44, borderRadius: '50%',
          background: '#272729', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>

        {/* Stop */}
        <button onClick={handleStop} style={{
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
  )
}
