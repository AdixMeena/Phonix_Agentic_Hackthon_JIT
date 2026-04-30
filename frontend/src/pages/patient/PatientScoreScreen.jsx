import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function AnimatedNumber({ target, duration = 1800 }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const frame = () => {
      const elapsed  = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [target, duration])
  return <>{current}</>
}

export default function PatientScoreScreen() {
  const navigate  = useNavigate()
  const location  = useLocation()

  const state       = location.state || {}
  const score       = state.score       || 0
  const reps        = state.reps        || 0
  const duration    = state.duration    || 0
  const jointScores = state.jointScores || []   // array of { name, score, status }
  const analysis    = state.analysis    || null  // full agent output or null

  // Use agent's score if available, otherwise raw score
  const displayScore    = analysis?.overall_score     ?? score
  const patientMessage  = analysis?.patient_message   ?? null
  const mistakes        = analysis?.mistakes          ?? []
  const completedBadge  = analysis?.completion_confirmed ?? null
  const trendNote       = analysis?.trend_note        ?? null

  const fallbackMessage = displayScore >= 80
    ? 'Excellent session'
    : displayScore >= 60
    ? 'Good effort'
    : 'Keep practicing'

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 24px 40px',
      fontFamily: '"Inter", sans-serif',
      overflowY: 'auto',
    }}>

      {/* ── Score ── */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'center' }}>
          <div style={{
            fontSize: 80, fontWeight: 600, color: '#fff',
            fontFamily: '"Inter Tight", sans-serif', lineHeight: 1,
          }}>
            <AnimatedNumber target={displayScore} />
          </div>
          <div style={{ fontSize: 32, color: '#6e6e73', fontWeight: 400 }}>/ 100</div>
        </div>

        {/* Completion badge */}
        {completedBadge !== null && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 12,
            background: completedBadge ? '#34c75920' : '#ff3b3020',
            border: `1px solid ${completedBadge ? '#34c75940' : '#ff3b3040'}`,
            borderRadius: 980, padding: '4px 12px',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: completedBadge ? '#34c759' : '#ff3b30',
            }} />
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: completedBadge ? '#34c759' : '#ff3b30',
            }}>
              {completedBadge ? 'Exercise completed' : 'Incomplete'}
            </span>
          </div>
        )}

        {/* Message */}
        <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginTop: 14, lineHeight: 1.3 }}>
          {patientMessage
            ? patientMessage.split('. ')[0] + '.'
            : fallbackMessage}
        </div>
        {patientMessage && patientMessage.split('. ').length > 1 && (
          <div style={{ fontSize: 14, color: '#6e6e73', marginTop: 6, lineHeight: 1.5, maxWidth: 320 }}>
            {patientMessage.split('. ').slice(1).join('. ')}
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 32, marginTop: 24, justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6e6e73' }}>Reps completed</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#fff', marginTop: 2 }}>{reps}</div>
          </div>
          <div style={{ width: 1, background: '#2a2a2a' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6e6e73' }}>Duration</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#fff', marginTop: 2 }}>{fmt(duration)}</div>
          </div>
        </div>
      </div>

      {/* ── Mistakes from agent ── */}
      {mistakes.length > 0 && (
        <div style={{
          width: '100%', maxWidth: 380,
          background: '#111', borderRadius: 18,
          padding: 24, marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, color: '#6e6e73', marginBottom: 14, fontWeight: 600 }}>
            Areas to improve
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mistakes.map((mistake, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: '#ff9f0a20', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path d="M8 5v3.5M8 10.5v.5" stroke="#ff9f0a" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ fontSize: 14, color: '#ebebf5cc', lineHeight: 1.5 }}>{mistake}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Joint breakdown ── */}
      {jointScores.length > 0 && (
        <div style={{
          width: '100%', maxWidth: 380,
          background: '#111', borderRadius: 18,
          padding: 24, marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, color: '#6e6e73', marginBottom: 16, fontWeight: 600 }}>
            Joint analysis
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {jointScores.map(joint => (
              <div key={joint.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {joint.status === 'good' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#34c75920" />
                    <path d="M5 8l2.5 2.5L11 5.5" stroke="#34c759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#ff9f0a20" />
                    <path d="M8 5v3.5M8 10.5v.5" stroke="#ff9f0a" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                <div>
                  <div style={{ fontSize: 13, color: '#6e6e73', textTransform: 'capitalize' }}>
                    {joint.name.replace(/_/g, ' ')}
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: joint.status === 'good' ? '#34c759' : '#ff9f0a',
                  }}>
                    {joint.score}/100
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Trend note ── */}
      {trendNote && trendNote !== 'First session recorded' && (
        <div style={{
          width: '100%', maxWidth: 380,
          background: '#0071e315',
          border: '1px solid #0071e330',
          borderRadius: 14, padding: '12px 16px',
          marginBottom: 16,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <div style={{ fontSize: 13, color: '#0071e3', lineHeight: 1.5 }}>{trendNote}</div>
        </div>
      )}

      {/* ── Done button ── */}
      <button
        onClick={() => navigate('/patient')}
        style={{
          width: '100%', maxWidth: 380,
          background: '#fff', color: '#1d1d1f',
          border: 'none', borderRadius: 980,
          padding: '16px 24px', fontSize: 17, fontWeight: 600,
          cursor: 'pointer', transition: 'opacity 0.15s',
          marginTop: 8,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Done
      </button>
    </div>
  )
}