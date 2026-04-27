import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DoctorHeader from '../../components/DoctorHeader.jsx'
import { Card, BtnPrimary, BtnOutline } from '../../components/UI.jsx'
import { patients, exercises } from '../../data.js'

export default function DoctorAssignExercise() {
  const { id } = useParams()
  const navigate = useNavigate()
  const patient = patients.find(p => p.id === Number(id))
  const [selected, setSelected] = useState(new Set())
  const [filterCat, setFilterCat] = useState('All')
  const [assigned, setAssigned] = useState(false)

  const categories = ['All', ...new Set(exercises.map(e => e.category))]
  const filtered = filterCat === 'All' ? exercises : exercises.filter(e => e.category === filterCat)

  function toggle(exId) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(exId) ? n.delete(exId) : n.add(exId)
      return n
    })
  }

  function handleAssign() {
    setAssigned(true)
    setTimeout(() => navigate(`/doctor/patient/${id}`), 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7' }}>
      <DoctorHeader />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 48px' }}>
        <button onClick={() => navigate(`/doctor/patient/${id}`)} style={{
          background: 'none', border: 'none', color: '#0071e3',
          fontSize: 14, cursor: 'pointer', marginBottom: 24, padding: 0,
        }}>
          ← Back to {patient?.name}
        </button>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: '#1d1d1f', fontFamily: '"Inter Tight", sans-serif', margin: 0 }}>
            Assign exercises
          </h1>
          <p style={{ fontSize: 17, color: '#6e6e73', marginTop: 8 }}>
            Select exercises for {patient?.name}'s rehabilitation program
          </p>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{
              background: filterCat === cat ? '#0071e3' : '#fff',
              color: filterCat === cat ? '#fff' : '#1d1d1f',
              border: `1px solid ${filterCat === cat ? '#0071e3' : '#d2d2d7'}`,
              borderRadius: 980, padding: '6px 16px',
              fontSize: 14, fontWeight: filterCat === cat ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{cat}</button>
          ))}
        </div>

        {/* Exercise list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {filtered.map(ex => {
            const isSelected = selected.has(ex.id)
            return (
              <div key={ex.id} onClick={() => toggle(ex.id)} style={{
                background: isSelected ? '#0071e308' : '#fff',
                border: `1px solid ${isSelected ? '#0071e3' : '#d2d2d7'}`,
                borderRadius: 18, padding: 20, cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                {/* Checkbox */}
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${isSelected ? '#0071e3' : '#d2d2d7'}`,
                  background: isSelected ? '#0071e3' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s',
                }}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 19, fontWeight: 600, color: '#1d1d1f' }}>{ex.name}</div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: '#6e6e73',
                      background: '#f5f5f7', borderRadius: 980, padding: '2px 10px',
                    }}>{ex.category}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#6e6e73' }}>{ex.duration} · {ex.difficulty}</div>
                  <div style={{ fontSize: 14, color: '#86868b', marginTop: 4, lineHeight: 1.4 }}>
                    {ex.instructions.slice(0, 100)}...
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sticky bottom bar */}
        <div style={{
          position: 'sticky', bottom: 0,
          background: '#f5f5f7', paddingTop: 16, paddingBottom: 24,
          borderTop: '1px solid #d2d2d7', marginTop: 8,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <BtnOutline onClick={() => navigate(`/doctor/patient/${id}`)}>Cancel</BtnOutline>
          <BtnPrimary
            onClick={handleAssign}
            style={{ opacity: selected.size === 0 ? 0.4 : 1 }}
          >
            {assigned ? 'Assigned ✓' : `Assign ${selected.size > 0 ? selected.size : ''} exercise${selected.size !== 1 ? 's' : ''}`}
          </BtnPrimary>
          {selected.size > 0 && (
            <span style={{ fontSize: 14, color: '#6e6e73' }}>
              {selected.size} selected
            </span>
          )}
        </div>
      </main>
    </div>
  )
}
