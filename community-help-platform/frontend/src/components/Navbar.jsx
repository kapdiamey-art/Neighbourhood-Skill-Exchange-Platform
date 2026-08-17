import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/',               label: 'Dashboard' },
    { to: '/find-help',      label: 'Find Help' },
    { to: '/create-request', label: 'New Request' },
    { to: '/my-requests',    label: 'My Requests' },
    { to: '/profile',        label: 'Profile' },
  ]

  const isActive = (path) => location.pathname === path

  const closeMobile = () => setMobileOpen(false)

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

      {/* Desktop auth buttons */}
      <div className="navbar__auth">
        <Link to="/login" className="navbar__login-btn">Log in</Link>
        <Link to="/register" className="navbar__register-btn">Sign up</Link>
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
          <Link to="/login" className="navbar__login-btn" onClick={closeMobile}>Log in</Link>
          <Link to="/register" className="navbar__register-btn" onClick={closeMobile}>Sign up</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
