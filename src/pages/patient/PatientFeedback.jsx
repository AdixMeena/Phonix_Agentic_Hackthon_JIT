import React, { useState } from 'react'
import PatientBottomNav from '../../components/PatientBottomNav.jsx'
import { feedbackMessages } from '../../data.js'

export default function PatientFeedback() {
  const [messages] = useState(feedbackMessages)

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', paddingBottom: 80, fontFamily: '"Inter", sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '56px 24px 20px', borderBottom: '1px solid #d2d2d7' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, color: '#1d1d1f', fontFamily: '"Inter Tight", sans-serif', margin: 0 }}>
          Feedback
        </h1>
        <p style={{ fontSize: 17, color: '#6e6e73', marginTop: 6 }}>Messages from your physiotherapist</p>
      </div>

      <div style={{ padding: '24px' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6e6e73', fontSize: 17 }}>
            No messages yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                borderLeft: msg.unread ? '3px solid #0071e3' : '3px solid transparent',
                paddingLeft: msg.unread ? 12 : 0,
              }}>
                <div style={{
                  background: '#f5f5f7',
                  borderRadius: '12px 12px 12px 0px',
                  padding: '16px 18px',
                }}>
                  <div style={{ fontSize: 12, color: '#0071e3', fontWeight: 600, marginBottom: 8 }}>
                    {msg.from}
                  </div>
                  <p style={{
                    fontSize: 17, color: '#1d1d1f',
                    lineHeight: 1.47, letterSpacing: '-0.374px',
                    margin: 0,
                  }}>
                    {msg.message}
                  </p>
                  <div style={{ fontSize: 12, color: '#6e6e73', marginTop: 10 }}>
                    {msg.time}
                    {msg.unread && (
                      <span style={{
                        marginLeft: 8, fontSize: 11, color: '#0071e3', fontWeight: 600,
                        background: '#0071e315', borderRadius: 980, padding: '2px 8px',
                      }}>New</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PatientBottomNav />
    </div>
  )
}
