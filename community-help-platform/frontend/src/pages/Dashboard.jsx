import { Link } from 'react-router-dom'
import UserCard from '../components/UserCard'
import { currentUser, mockUsers } from '../data/mockData'
import './Dashboard.css'

function Dashboard() {
  const nearbyPeople = mockUsers.filter(
    (u) => u.neighborhood === currentUser.neighborhood && u.id !== currentUser.id
  )

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard__banner">
        <h1 className="dashboard__banner-title">Welcome back, {currentUser.name} 👋</h1>
        <p className="dashboard__banner-sub">
          Your neighbourhood is ready to help — and so are you.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="dashboard__actions">
        <Link to="/find-help" className="dashboard__action-card dashboard__action-card--search">
          <span className="dashboard__action-icon">🔍</span>
          <div className="dashboard__action-title">Search for Help</div>
          <div className="dashboard__action-desc">Find skilled people near you</div>
        </Link>

        <Link to="/create-request" className="dashboard__action-card dashboard__action-card--emergency">
          <span className="dashboard__action-icon">🚨</span>
          <div className="dashboard__action-title">Emergency Request</div>
          <div className="dashboard__action-desc">Post an urgent help request</div>
        </Link>

        <Link to="/my-requests" className="dashboard__action-card dashboard__action-card--requests">
          <span className="dashboard__action-icon">📋</span>
          <div className="dashboard__action-title">My Requests</div>
          <div className="dashboard__action-desc">Track your help requests</div>
        </Link>
      </div>

      {/* Nearby Skilled People */}
      <div className="dashboard__section-header">
        <h2 className="dashboard__section-title">Nearby Skilled People</h2>
        <p className="dashboard__section-subtitle">People in {currentUser.neighborhood}</p>
      </div>

      {nearbyPeople.length > 0 ? (
        <div className="dashboard__cards-grid">
          {nearbyPeople.map((user) => (
            <UserCard
              key={user.id}
              name={user.name}
              profession={user.profession}
              neighborhood={user.neighborhood}
              rating={user.rating}
            />
          ))}
        </div>
      ) : (
        <p className="dashboard__empty">No other skilled people found in your neighbourhood yet.</p>
      )}
    </div>
  )
}

export default Dashboard
