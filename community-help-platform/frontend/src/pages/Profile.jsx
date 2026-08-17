import { currentUser } from '../data/mockData'
import './Profile.css'

function Profile() {
  return (
    <div className="profile">
      <div className="profile__card">
        {/* Header */}
        <div className="profile__header">
          <div className="profile__avatar">
            {currentUser.name.charAt(0)}
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
          <div className="profile__tags">
            {currentUser.skills.map((skill) => (
              <span key={skill} className="profile__tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
