import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { currentUser, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/',               label: 'Dashboard' },
    { to: '/find-help',      label: 'Find Help' },
    { to: '/create-request', label: 'New Request' },
    { to: '/my-requests',    label: 'My Requests' },
    { to: '/profile',        label: 'Profile' },
  ]

  const isActive   = (path) => location.pathname === path
  const closeMobile = () => setMobileOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    closeMobile()
  }

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar__brand" onClick={closeMobile}>
        <span className="navbar__brand-icon">🏘️</span>
        CommunityHelp
      </Link>

      {/* Desktop nav links */}
      <div className="navbar__links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar__link ${isActive(link.to) ? 'navbar__link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Desktop auth buttons — change based on login state */}
      <div className="navbar__auth">
        {currentUser ? (
          <>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted, #888)',
              alignSelf: 'center' }}>
              👤 {currentUser.name.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="navbar__login-btn"
              style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="navbar__login-btn">Log in</Link>
            <Link to="/register" className="navbar__register-btn">Sign up</Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="navbar__hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="navbar__mobile-menu">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${isActive(link.to) ? 'navbar__link--active' : ''}`}
              onClick={closeMobile}
            >
              {link.label}
            </Link>
          ))}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="navbar__login-btn"
              style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
            >
              Log out
            </button>
          ) : (
            <>
              <Link to="/login"    className="navbar__login-btn"    onClick={closeMobile}>Log in</Link>
              <Link to="/register" className="navbar__register-btn" onClick={closeMobile}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
