import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

function Profile() {
  const { currentUser, logout } = useAuth()

  if (!currentUser) {
    return (
      <div className="profile">
        <div className="profile__card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '3rem' }}>👤</p>
          <h1 className="profile__name">Not logged in</h1>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>
            Sign in to view your profile.
          </p>
          <Link to="/login" className="btn btn--primary">Sign in</Link>
        </div>
      </div>
    )
  }

  const skillsArr = currentUser.skills
    ? currentUser.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <div className="profile">
      <div className="profile__card">
        {/* Header */}
        <div className="profile__header">
          <div className="profile__avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__profession">{currentUser.profession}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="profile__info-grid">
          <div className="profile__info-item">
            <span className="profile__info-label">📧 Email</span>
            <span className="profile__info-value">{currentUser.email}</span>
          </div>
          <div className="profile__info-item">
            <span className="profile__info-label">📍 Neighborhood</span>
            <span className="profile__info-value">{currentUser.neighborhood}</span>
          </div>
          <div className="profile__info-item">
            <span className="profile__info-label">🕐 Availability</span>
            <span className="profile__info-value">{currentUser.availability}</span>
          </div>
          <div className="profile__info-item">
            <span className="profile__info-label">⭐ Rating</span>
            <span className="profile__info-value">{currentUser.rating} / 5</span>
          </div>
        </div>

        {/* Skills */}
        <div className="profile__section">
          <h2 className="profile__section-title">Skills</h2>
          {skillsArr.length > 0 ? (
            <div className="profile__tags">
              {skillsArr.map((skill) => (
                <span key={skill} className="profile__tag">{skill}</span>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No skills listed yet.</p>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid #ef4444',
            color: '#ef4444', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer',
            fontSize: '0.95rem', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.target.style.background = '#fef2f2' }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export default Profile
