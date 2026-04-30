import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DoctorHeader from '../../components/DoctorHeader.jsx'
import DoctorBottomNav from '../../components/DoctorBottomNav.jsx'
import { Card, ScoreBadge, StatusBadge, BtnPrimary, BtnSecondary } from '../../components/UI.jsx'
import { supabase } from '../../lib/supabase.js'
import { AuthContext } from '../../App.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DoctorPatientDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { user }   = useContext(AuthContext)

  const [patient,          setPatient]          = useState(null)
  const [patientExercises, setPatientExercises] = useState([])
  const [analyses,         setAnalyses]         = useState([])   // session_analysis rows
  const [loadingAnalyses,  setLoadingAnalyses]  = useState(false)
  const [loading,          setLoading]          = useState(true)
  const [error,            setError]            = useState('')
  const [tab,              setTab]              = useState('overview')
  const [note,             setNote]             = useState('')
  const [noteFocused,      setNoteFocused]      = useState(false)
  const [sending,          setSending]          = useState(false)
  const [removing,         setRemoving]         = useState(false)
  const [expandedReport,   setExpandedReport]   = useState(null) // which analysis id is expanded

  // ── Load patient ────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true

    async function loadPatient() {
      if (!user) return
      setError('')
      setLoading(true)

      const { data: connectionRows, error: connectionError } = await supabase
        .from('connections')
        .select('status')
        .eq('doctor_id', user.id)
        .eq('patient_id', id)
        .eq('status', 'approved')

      if (connectionError) {
        if (isMounted) { setError(connectionError.message); setLoading(false) }
        return
      }

      if (!connectionRows || connectionRows.length === 0) {
        if (isMounted) { setError('No approved connection for this patient.'); setLoading(false) }
        return
      }

      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('id', id)
        .maybeSingle()

      if (profileError) {
        if (isMounted) { setError(profileError.message); setLoading(false) }
        return
      }

      const { data: patientRow, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (patientError) {
        if (isMounted) { setError(patientError.message); setLoading(false) }
        return
      }

      let ensuredPatient = patientRow
      if (!patientRow) {
        const { data: createdRow, error: createError } = await supabase
          .from('patients')
          .insert({
            user_id:   id,
            doctor_id: user.id,
            name:      profileRow?.name || 'New patient',
            condition: 'Recovery plan',
            age:       null,
            score:     0,
            streak:    0,
            progress:  [],
          })
          .select('*')
          .maybeSingle()

        if (createError) {
          if (isMounted) { setError(createError.message); setLoading(false) }
          return
        }
        ensuredPatient = createdRow
      }

      let assignments = []
      if (ensuredPatient?.id) {
        const { data: assignmentRows } = await supabase
          .from('patient_exercises')
          .select('status, exercises (id, name, category, duration, difficulty)')
          .eq('patient_id', ensuredPatient.id)

        assignments = (assignmentRows || []).map(row => ({
          ...row.exercises,
          status: row.status,
        }))
      }

      if (isMounted) {
        setPatient(ensuredPatient)
        setPatientExercises(assignments)
        setLoading(false)
      }
    }

    loadPatient()
    return () => { isMounted = false }
  }, [user, id])

  // ── Load analyses when reports tab is opened ────────────────────────────────
  useEffect(() => {
    if (tab !== 'reports') return
    let isMounted = true

    async function loadAnalyses() {
      setLoadingAnalyses(true)
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const res     = await fetch(`${apiBase}/analysis/${id}`)
        const json    = await res.json()
        if (isMounted) setAnalyses(json.data || [])
      } catch {
        // fallback — try Supabase directly
        try {
          const { data } = await supabase
            .from('session_analysis')
            .select('*')
            .eq('patient_id', id)
            .order('created_at', { ascending: false })
            .limit(20)
          if (isMounted) setAnalyses(data || [])
        } catch { /* silent */ }
      } finally {
        if (isMounted) setLoadingAnalyses(false)
      }
    }

    loadAnalyses()
    return () => { isMounted = false }
  }, [tab, id])

  if (loading)  return <div style={{ padding: 24, color: '#6e6e73' }}>Loading patient...</div>
  if (error)    return <div style={{ padding: 24, color: '#ff3b30' }}>{error}</div>
  if (!patient) return <div>Patient not found</div>

  const progress  = Array.isArray(patient.progress) && patient.progress.length > 0
    ? patient.progress
    : [62, 64, 66, 68, 70, 72, 74]
  const chartData = progress.map((score, i) => ({ day: days[i], score }))

  async function handleRemovePatient() {
    if (!user) return
    const ok = window.confirm('Remove this patient from your list?')
    if (!ok) return

    setRemoving(true)
    setError('')

    const { error: updateError } = await supabase
      .from('patients')
      .update({ doctor_id: null })
      .eq('user_id', id)

    if (updateError) { setError(updateError.message); setRemoving(false); return }

    const { error: deleteError } = await supabase
      .from('connections')
      .delete()
      .eq('doctor_id', user.id)
      .eq('patient_id', id)

    if (deleteError) { setError(deleteError.message); setRemoving(false); return }

    navigate('/doctor')
  }

  const fmtDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const scoreColor = (s) =>
    s >= 80 ? '#34c759' : s >= 60 ? '#ff9f0a' : '#ff3b30'

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', paddingBottom: 88 }}>
      <DoctorHeader />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 48px' }}>

        {error && (
          <div style={{
            background: '#ff3b3010', border: '1px solid #ff3b3030',
            borderRadius: 12, padding: '12px 16px',
            fontSize: 13, color: '#ff3b30', lineHeight: 1.5, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Back */}
        <button onClick={() => navigate('/doctor')} style={{
          background: 'none', border: 'none', color: '#0071e3',
          fontSize: 14, cursor: 'pointer', marginBottom: 24, padding: 0,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← Back to patients
        </button>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 32, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <h1 style={{
              fontSize: 32, fontWeight: 600, color: '#1d1d1f',
              fontFamily: '"Inter Tight", sans-serif', margin: 0,
            }}>
              {patient.name}
            </h1>
            <p style={{ fontSize: 17, color: '#6e6e73', marginTop: 6 }}>
              {patient.condition} · Age {patient.age}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <ScoreBadge score={patient.score} size={56} />
            <BtnPrimary onClick={() => navigate(`/doctor/assign/${id}`)}>
              Assign exercise
            </BtnPrimary>
            <button
              onClick={handleRemovePatient}
              disabled={removing}
              style={{
                background: '#fff', color: '#ff3b30', border: '1px solid #ff3b3030',
                borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 600,
                cursor: removing ? 'default' : 'pointer', opacity: removing ? 0.6 : 1,
              }}
            >
              {removing ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>

        {/* Tabs — added 'reports' tab */}
        <div style={{ borderBottom: '1px solid #d2d2d7', display: 'flex', gap: 0, marginBottom: 32 }}>
          {['overview', 'exercises', 'reports', 'notes'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid #0071e3' : '2px solid transparent',
              padding: '10px 20px',
              fontSize: 14, fontWeight: 600,
              color: tab === t ? '#1d1d1f' : '#6e6e73',
              cursor: 'pointer', marginBottom: -1,
              transition: 'color 0.15s',
              textTransform: 'capitalize',
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Card style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 19, fontWeight: 600, color: '#1d1d1f', marginBottom: 4 }}>Score progression</div>
              <div style={{ fontSize: 14, color: '#6e6e73', marginBottom: 20 }}>Past 7 days</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#d2d2d7" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6e6e73' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6e6e73' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #d2d2d7', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#1d1d1f', fontWeight: 600 }}
                  />
                  <Line
                    type="monotone" dataKey="score" stroke="#0071e3" strokeWidth={2}
                    dot={{ fill: '#fff', stroke: '#0071e3', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <div style={{ fontSize: 14, color: '#6e6e73', marginBottom: 8 }}>Current streak</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#1d1d1f' }}>{patient.streak} days</div>
              <div style={{ fontSize: 12, color: patient.streak > 0 ? '#34c759' : '#ff3b30', marginTop: 4 }}>
                {patient.streak > 0 ? 'On track' : 'Streak broken'}
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 14, color: '#6e6e73', marginBottom: 8 }}>Exercises assigned</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#1d1d1f' }}>{patientExercises.length}</div>
              <div style={{ fontSize: 12, color: '#6e6e73', marginTop: 4 }}>Active program</div>
            </Card>

            <Card style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 19, fontWeight: 600, color: '#1d1d1f', marginBottom: 12 }}>Doctor notes</div>
              <p style={{ fontSize: 17, color: '#1d1d1f', lineHeight: 1.47, letterSpacing: '-0.374px' }}>
                {patient.notes || 'No notes yet.'}
              </p>
            </Card>
          </div>
        )}

        {/* ── Exercises tab ── */}
        {tab === 'exercises' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {patientExercises.map(ex => (
              <Card key={ex.id} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 19, fontWeight: 600, color: '#1d1d1f' }}>{ex.name}</div>
                    <StatusBadge status={ex.status} />
                  </div>
                  <div style={{ fontSize: 14, color: '#6e6e73' }}>
                    {ex.category} · {ex.duration} · {ex.difficulty}
                  </div>
                </div>
                <BtnDestructiveSmall>Remove</BtnDestructiveSmall>
              </Card>
            ))}
            <div style={{ marginTop: 8 }}>
              <BtnPrimary onClick={() => navigate(`/doctor/assign/${id}`)}>
                + Assign new exercise
              </BtnPrimary>
            </div>
          </div>
        )}

        {/* ── AI Reports tab (NEW) ── */}
        {tab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {loadingAnalyses && (
              <div style={{ padding: 32, textAlign: 'center', color: '#6e6e73', fontSize: 14 }}>
                Loading session reports...
              </div>
            )}

            {!loadingAnalyses && analyses.length === 0 && (
              <Card>
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>
                    No AI reports yet
                  </div>
                  <div style={{ fontSize: 14, color: '#6e6e73' }}>
                    Reports will appear here after the patient completes exercise sessions.
                  </div>
                </div>
              </Card>
            )}

            {!loadingAnalyses && analyses.map((a) => (
              <Card key={a.id} style={{ padding: 0, overflow: 'hidden' }}>

                {/* Report header row */}
                <div
                  onClick={() => setExpandedReport(expandedReport === a.id ? null : a.id)}
                  style={{
                    padding: '18px 24px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', cursor: 'pointer',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                    {/* Score circle */}
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                      background: `${scoreColor(a.overall_score)}15`,
                      border: `2px solid ${scoreColor(a.overall_score)}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        fontSize: 14, fontWeight: 700,
                        color: scoreColor(a.overall_score),
                      }}>
                        {a.overall_score}
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>
                          Session Report
                        </div>
                        {/* Completion badge */}
                        <div style={{
                          fontSize: 11, fontWeight: 600,
                          color: a.completion_confirmed ? '#34c759' : '#ff3b30',
                          background: a.completion_confirmed ? '#34c75915' : '#ff3b3015',
                          border: `1px solid ${a.completion_confirmed ? '#34c75930' : '#ff3b3030'}`,
                          borderRadius: 980, padding: '2px 8px',
                        }}>
                          {a.completion_confirmed ? 'Completed' : 'Incomplete'}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: '#6e6e73' }}>{fmtDate(a.created_at)}</div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#6e6e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      transform: expandedReport === a.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded report body */}
                {expandedReport === a.id && (
                  <div style={{
                    borderTop: '1px solid #f0f0f5',
                    padding: '20px 24px',
                    display: 'flex', flexDirection: 'column', gap: 20,
                  }}>

                    {/* Doctor report */}
                    {a.doctor_report && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6e6e73', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Clinical Summary
                        </div>
                        <p style={{ fontSize: 15, color: '#1d1d1f', lineHeight: 1.6, margin: 0 }}>
                          {a.doctor_report}
                        </p>
                      </div>
                    )}

                    {/* Mistakes */}
                    {Array.isArray(a.mistakes) && a.mistakes.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6e6e73', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Issues Identified
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {a.mistakes.map((m, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                              <div style={{
                                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                background: '#ff9f0a15',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginTop: 1,
                              }}>
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                  <path d="M8 5v3.5M8 10.5v.5" stroke="#ff9f0a" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                              </div>
                              <span style={{ fontSize: 14, color: '#3a3a3c', lineHeight: 1.5 }}>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trend note */}
                    {a.trend_note && (
                      <div style={{
                        background: '#0071e310',
                        border: '1px solid #0071e325',
                        borderRadius: 10, padding: '10px 14px',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          <polyline points="16 7 22 7 22 13" />
                        </svg>
                        <span style={{ fontSize: 13, color: '#0071e3', lineHeight: 1.5 }}>{a.trend_note}</span>
                      </div>
                    )}

                    {/* Patient message — doctor can see what patient saw */}
                    {a.patient_message && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6e6e73', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Message Sent to Patient
                        </div>
                        <p style={{
                          fontSize: 14, color: '#6e6e73', lineHeight: 1.6, margin: 0,
                          fontStyle: 'italic',
                        }}>
                          "{a.patient_message}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* ── Notes tab ── */}
        {tab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <div style={{ fontSize: 19, fontWeight: 600, color: '#1d1d1f', marginBottom: 16 }}>
                Send feedback to patient
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                onFocus={() => setNoteFocused(true)}
                onBlur={() => setNoteFocused(false)}
                placeholder="Write a message or feedback for your patient..."
                rows={5}
                style={{
                  width: '100%', background: '#fff',
                  border: `1px solid ${noteFocused ? '#0071e3' : '#86868b'}`,
                  borderRadius: 12, padding: '12px 16px',
                  fontSize: 17, color: '#1d1d1f',
                  resize: 'vertical', outline: 'none',
                  transition: 'border-color 0.15s',
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.47,
                }}
              />
              <div style={{ marginTop: 12 }}>
                <BtnPrimary
                  onClick={() => {
                    if (!note.trim() || !user) return
                    setSending(true)
                    supabase
                      .from('feedback')
                      .insert({ patient_id: id, doctor_id: user.id, message: note.trim() })
                      .then(({ error: insertError }) => {
                        if (insertError) { setError(insertError.message); setSending(false); return }
                        setNote('')
                        setSending(false)
                      })
                  }}
                  style={{ opacity: sending ? 0.6 : 1 }}
                >
                  {sending ? 'Sending…' : 'Send feedback'}
                </BtnPrimary>
              </div>
            </Card>
          </div>
        )}

      </main>
      <DoctorBottomNav />
    </div>
  )
}

function BtnDestructiveSmall({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#ff3b3015', color: '#ff3b30',
      borderRadius: 980, padding: '6px 14px',
      fontSize: 12, fontWeight: 600, border: '1px solid #ff3b3030',
      cursor: 'pointer',
    }}>{children}</button>
  )
}