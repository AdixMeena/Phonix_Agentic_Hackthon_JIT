import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../App.jsx'
import { supabase } from '../lib/supabase.js'

export default function PatientHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initial = userName.charAt(0).toUpperCase()

  const navLinks = [
    { label: 'Home', path: '/patient' },
    { label: 'Doctors', path: '/patient/find-doctor' },
    { label: 'AI Chat', path: '/patient/chat' },
    { label: 'Profile', path: '/patient/profile' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('nav') && !e.target.closest('.mobile-menu')) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <>
      <style>{`
        .nav-outer {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 10px 20px;
        }

        nav {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 56px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.3s ease;
        }

        nav:hover {
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.09), 0 1px 4px rgba(0, 0, 0, 0.05);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-align: left;
        }

        .brand-logo {
          width: 32px;
          height: 32px;
          background: #0071e3;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .brand-name {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1d1d1f;
          letter-spacing: -0.3px;
        }

        .brand-sub {
          font-size: 10px;
          color: #6e6e73;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-links button {
          font-size: 14px;
          font-weight: 500;
          color: #1d1d1f;
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          background: none;
          border: none;
          cursor: pointer;
        }

        .nav-links button:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .nav-links button.active {
          color: #0071e3;
          background: rgba(0, 113, 227, 0.08);
          font-weight: 600;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 6px;
          background: rgba(0,0,0,0.04);
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .user-pill:hover { background: rgba(0,0,0,0.07); }

        .avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34c759, #0071e3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #1d1d1f;
        }

        .logout-btn {
          font-size: 13px;
          font-weight: 500;
          color: #6e6e73;
          background: none;
          border: 1px solid #d2d2d7;
          border-radius: 10px;
          padding: 6px 12px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          font-family: 'Inter', sans-serif;
        }

        .logout-btn:hover {
          color: #ff3b30;
          border-color: #ff3b30;
        }

        .burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: none;
          border: none;
          cursor: pointer;
          gap: 5px;
          transition: background 0.15s;
        }

        .burger:hover { background: rgba(0,0,0,0.05); }

        .burger span {
          display: block;
          width: 18px;
          height: 1.5px;
          background: #1d1d1f;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
          transform-origin: center;
        }

        .burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 80px;
          left: 10px;
          right: 10px;
          z-index: 99;
          border-radius: 18px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: saturate(180%) blur(24px);
          -webkit-backdrop-filter: saturate(180%) blur(24px);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          padding: 12px;
          flex-direction: column;
          gap: 4px;
          animation: slideDown 0.22s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-menu.open { display: flex; }

        .mobile-menu button {
          font-size: 15px;
          font-weight: 500;
          color: #1d1d1f;
          text-decoration: none;
          padding: 11px 16px;
          border-radius: 12px;
          transition: background 0.15s;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
        }

        .mobile-menu button:hover { background: rgba(0,0,0,0.05); }
        .mobile-menu button.active { color: #0071e3; background: rgba(0,113,227,0.08); font-weight: 600; }

        .mobile-divider {
          height: 1px;
          background: #e5e5ea;
          margin: 6px 0;
        }

        .mobile-user-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-logout {
          font-size: 13px;
          font-weight: 500;
          color: #ff3b30;
          background: rgba(255,59,48,0.08);
          border: none;
          border-radius: 10px;
          padding: 7px 12px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .logout-btn { display: none; }
          .user-pill { display: none; }
          .burger { display: flex; }
        }
      `}</style>

      <div className="nav-outer">
        <nav>
          <button className="brand" onClick={() => navigate('/patient')}>
            <div className="brand-logo">
              <svg width="22" height="22" viewBox="0 0 750 750" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ffffff" d="m208.00003,254.6l3.6,-0.6c-20.9,9.9 -49,30.4 -67.8,44.9c-30.4,23.3 -54.1,57.9 -74,92.9c84.1,-45.7 161.8,-52.4 178.5,-48.2c0.2,0.1 -7.7,45.5 -36.7,83.6c-30.5,39.9 -82.2,72.4 -82.2,72.4c18.9,2.2 37.9,2.6 56.7,0.8c32.2,-3 65.3,-12.4 91.5,-34.7c11.6,-9.9 32.8,-39 30.5,-34.8c-12.5,31.2 -14.3,66.7 -12.3,100.6c1.1,19.9 3.2,39.6 9.1,58.4c5,16.1 12.3,31.2 20.6,45.3l8.2,6.5c0.1,-0.7 -7.9,-111.8 48.5,-166.7c102.6,-99.8 216,-4.9 216,-4.9s-4.5,-75.2 -89.6,-111.7c203.8,-18.8 159.7,102 159.7,102s69.8,-29.8 59.1,-114.9c-9.7,-77 -85,-95.3 -100.7,-98.3c-13.2,-21.7 -113.2,-186.8 -279.8,-121.9c-180.6,70.3 -326.9,53.6 -326.9,53.6c21.5,24.7 46.7,44.6 74.1,58.7c35.6,18.4 75.3,23.8 113.9,17zm314,-15.9c6.3,2.1 12.7,4.2 19.1,6.2c-0.5,6.1 -4.8,10.9 -10,10.9c-5.5,0 -10.1,-5.4 -10.1,-12.1c0.1,-1.8 0.4,-3.5 1,-5zm-40.1,2.4c0,-5.1 0.9,-9.9 2.6,-14.4c3.8,0.9 7.6,1.8 11.2,3c3.8,1.2 7.5,2.5 11.3,3.8c-1.1,3.1 -1.8,6.5 -1.8,10.1c0,15.4 11.6,27.9 25.9,27.9c12.6,0 23,-9.7 25.4,-22.5c2.7,0.6 5.3,1.3 8,1.8c-4.4,18.5 -20.9,32.3 -40.7,32.3c-23.2,0 -41.9,-18.8 -41.9,-42z"/>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">Phoenix-AI</span>
              <span className="brand-sub">Patient workspace</span>
            </div>
          </button>

          <div className="nav-links">
            {navLinks.map(link => (
              <button
                key={link.path}
                className={location.pathname === link.path ? 'active' : ''}
                onClick={() => {
                  navigate(link.path)
                  setIsMenuOpen(false)
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="nav-right">
            <div className="user-pill" onClick={() => navigate('/patient/profile')}>
              <div className="avatar">{initial}</div>
              <span className="user-name">{userName}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </div>

          <button
            className={`burger ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <button
            key={link.path}
            className={location.pathname === link.path ? 'active' : ''}
            onClick={() => {
              navigate(link.path)
              setIsMenuOpen(false)
            }}
          >
            {link.label}
          </button>
        ))}
        <div className="mobile-divider"></div>
        <div className="mobile-user-row">
          <div className="mobile-user-info">
            <div className="avatar">{initial}</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>{userName}</span>
          </div>
          <button className="mobile-logout" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </>
  )
}
