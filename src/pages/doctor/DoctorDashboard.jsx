import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DoctorHeader from '../../components/DoctorHeader.jsx'
import { Card, ScoreBadge } from '../../components/UI.jsx'
import { patients } from '../../data.js'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

function MiniChart({ data }) {
  const d = data.map((v, i) => ({ v }))
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={d}>
        <Line type="monotone" dataKey="v" stroke="#0071e3" strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <Card style={{ flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 12, color: '#6e6e73', fontWeight: 400, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 600, color: '#1d1d1f', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#34c759', marginTop: 6 }}>{sub}</div>}
    </Card>
  )
}

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  )

  const avgScore = Math.round(patients.reduce((a, b) => a + b.score, 0) / patients.length)
  const sessionToday = 3

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7' }}>
      <DoctorHeader />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 48px', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: '#1d1d1f', fontFamily: '"Inter Tight", sans-serif', margin: 0 }}>
            Patient overview
          </h1>
          <p style={{ fontSize: 17, color: '#6e6e73', marginTop: 8 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          <StatCard label="Total patients" value={patients.length} sub="+1 this month" />
          <StatCard label="Average score" value={avgScore} sub="↑ 4 pts this week" />
          <StatCard label="Sessions today" value={sessionToday} />
          <StatCard label="Alerts" value={patients.filter(p => p.score < 50).length} sub="Needs attention" />
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search patients or conditions..."
            style={{
              width: '100%', maxWidth: 420,
              background: '#fff', border: `1px solid ${focused ? '#0071e3' : '#d2d2d7'}`,
              borderRadius: 12, padding: '10px 16px',
              fontSize: 14, color: '#1d1d1f', outline: 'none',
              transition: 'border-color 0.15s',
            }}
          />
        </div>

        {/* Patient grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          <AddPatientCard onClick={() => alert('Add patient flow coming soon.')} />
          {filtered.map(patient => (
            <PatientCard key={patient.id} patient={patient} onClick={() => navigate(`/doctor/patient/${patient.id}`)} />
          ))}
        </div>
      </main>
    </div>
  )
}

function AddPatientCard({ onClick }) {
  return (
    <Card onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 190, borderStyle: 'dashed', borderColor: '#c7c7cc',
      background: '#fafafa',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: '#0071e3', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 600, marginBottom: 10,
        }}>
          +
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f' }}>Add patient</div>
        <div style={{ fontSize: 12, color: '#6e6e73', marginTop: 4 }}>Create a new profile</div>
      </div>
    </Card>
  )
}

function PatientCard({ patient, onClick }) {
  return (
    <Card onClick={onClick} style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <ScoreBadge score={patient.score} />
      </div>

      <div style={{ paddingRight: 60 }}>
        <div style={{ fontSize: 19, fontWeight: 600, color: '#1d1d1f', marginBottom: 4 }}>
          {patient.name}
        </div>
        <div style={{ fontSize: 14, color: '#6e6e73', marginBottom: 16 }}>
          {patient.condition}
        </div>
      </div>

      <MiniChart data={patient.progress} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid #d2d2d7' }}>
        <div>
          <div style={{ fontSize: 12, color: '#86868b' }}>Last session</div>
          <div style={{ fontSize: 12, color: '#1d1d1f', fontWeight: 600, marginTop: 2 }}>{patient.lastSession}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#86868b' }}>Streak</div>
          <div style={{ fontSize: 12, color: patient.streak > 0 ? '#34c759' : '#ff3b30', fontWeight: 600, marginTop: 2 }}>
            {patient.streak > 0 ? `${patient.streak} days` : 'None'}
          </div>
        </div>
      </div>
    </Card>
  )
}
