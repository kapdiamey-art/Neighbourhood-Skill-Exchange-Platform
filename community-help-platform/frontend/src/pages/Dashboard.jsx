import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserCard from '../components/UserCard'
import { usersAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
  const { currentUser } = useAuth()
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all users from the real backend
    usersAPI.getAll()
      .then(setAllUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Show users in the same neighborhood as the logged-in user
  const nearbyPeople = currentUser
    ? allUsers.filter(
        (u) => u.neighborhood === currentUser.neighborhood && u.id !== currentUser.id
      )
    : allUsers.slice(0, 6)  // if not logged in, show first 6

  const displayName = currentUser ? currentUser.name.split(' ')[0] : 'there'
  const displayNeighborhood = currentUser?.neighborhood || 'your neighbourhood'

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard__banner">
        <h1 className="dashboard__banner-title">Welcome back, {displayName} 👋</h1>
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
        <p className="dashboard__section-subtitle">People in {displayNeighborhood}</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted, #888)', padding: '1rem' }}>
          Loading community members…
        </p>
      ) : nearbyPeople.length > 0 ? (
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
        <p className="dashboard__empty">
          No other skilled people found in your neighbourhood yet.{' '}
          {!currentUser && <Link to="/register">Register to join the community!</Link>}
        </p>
      )}
    </div>
  )
}

export default Dashboard
