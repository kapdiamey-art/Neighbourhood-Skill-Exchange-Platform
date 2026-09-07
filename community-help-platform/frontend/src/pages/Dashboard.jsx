import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserCard from '../components/UserCard'
import { usersAPI, requestsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
  const { currentUser } = useAuth()
  const [allUsers, setAllUsers]         = useState([])
  const [allRequests, setAllRequests]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [offeredIds, setOfferedIds]     = useState([])
  const [filterMode, setFilterMode]     = useState('all') // 'matching' | 'all'

  useEffect(() => {
    Promise.all([usersAPI.getAll(), requestsAPI.getAll()])
      .then(([usersData, requestsData]) => {
        setAllUsers(usersData)
        setAllRequests(requestsData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // User's skills array
  const userSkillsArr = currentUser?.skills
    ? currentUser.skills.split(',').map((s) => s.trim().toLowerCase())
    : []

  // Helper to check if a request matches user's skills
  const isSkillMatch = (req) => {
    if (!req.skill_required || userSkillsArr.length === 0) return false
    const reqSkill = req.skill_required.trim().toLowerCase()
    return userSkillsArr.some((s) => s.includes(reqSkill) || reqSkill.includes(s))
  }

  // Show users in the same neighborhood as the logged-in user
  const nearbyPeople = currentUser
    ? allUsers.filter(
        (u) => u.neighborhood === currentUser.neighborhood && u.id !== currentUser.id
      )
    : allUsers.slice(0, 6)

  // Requests posted by OTHER users
  const otherRequests = currentUser
    ? allRequests.filter((req) => req.created_by !== currentUser.id)
    : allRequests

  // Filter requests based on selected filterMode
  const displayedRequests = otherRequests.filter((req) => {
    if (filterMode === 'matching') {
      return isSkillMatch(req)
    }
    return true
  })

  const displayName = currentUser ? currentUser.name.split(' ')[0] : 'there'
  const displayNeighborhood = currentUser?.neighborhood || 'your neighbourhood'

  const handleOfferHelp = async (reqId) => {
    if (!currentUser) {
      alert('Please log in to offer help!')
      return
    }
    try {
      const updated = await requestsAPI.updateStatus(reqId, 'In Progress', currentUser.id)
      setOfferedIds((prev) => [...prev, reqId])
      setAllRequests((prev) =>
        prev.map((r) => (r.id === reqId ? updated : r))
      )
    } catch (err) {
      alert(err.message || 'Failed to offer help.')
    }
  }

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
          <div className="dashboard__action-desc">Find skilled people & open requests</div>
        </Link>

        <Link to="/create-request" className="dashboard__action-card dashboard__action-card--emergency">
          <span className="dashboard__action-icon">🚨</span>
          <div className="dashboard__action-title">Create Request</div>
          <div className="dashboard__action-desc">Post a help request for your neighbors</div>
        </Link>

        <Link to="/my-requests" className="dashboard__action-card dashboard__action-card--requests">
          <span className="dashboard__action-icon">📋</span>
          <div className="dashboard__action-title">My Requests</div>
          <div className="dashboard__action-desc">Track your help requests</div>
        </Link>
      </div>

      {/* Community Open Help Requests Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 className="dashboard__section-title">Open Community Requests</h2>
          <p className="dashboard__section-subtitle">Help requests posted by your neighbors</p>
        </div>

        {/* Smart Skill Filter Toggles */}
        {currentUser && (
          <div style={{ display: 'flex', gap: '0.5rem', background: '#eef2ff', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setFilterMode('all')}
              style={{
                padding: '0.4rem 0.8rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: filterMode === 'all' ? '#2563eb' : 'transparent',
                color: filterMode === 'all' ? '#ffffff' : '#4b5563',
              }}
            >
              🌐 All Requests ({otherRequests.length})
            </button>
            <button
              onClick={() => setFilterMode('matching')}
              style={{
                padding: '0.4rem 0.8rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: filterMode === 'matching' ? '#2563eb' : 'transparent',
                color: filterMode === 'matching' ? '#ffffff' : '#4b5563',
              }}
            >
              🎯 Matching My Skills ({otherRequests.filter(isSkillMatch).length})
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted, #888)', padding: '1rem' }}>
          Loading community requests…
        </p>
      ) : displayedRequests.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {displayedRequests.map((req) => {
            const matchesMySkill = isSkillMatch(req)
            const isOffered = offeredIds.includes(req.id) || req.status === 'In Progress' || (currentUser && req.helper_id === currentUser.id)

            return (
              <div key={req.id} style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: matchesMySkill ? '2px solid #10b981' : '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: req.urgency === 'High' ? '#fee2e2' : req.urgency === 'Medium' ? '#fef3c7' : '#e0e7ff',
                      color: req.urgency === 'High' ? '#991b1b' : req.urgency === 'Medium' ? '#92400e' : '#3730a3'
                    }}>
                      {req.urgency} Urgency
                    </span>
                    <span style={{ fontSize: '0.8rem', color: req.status === 'In Progress' ? '#f59e0b' : '#10b981', fontWeight: '600' }}>
                      ● {req.status}
                    </span>
                  </div>

                  {matchesMySkill && (
                    <div style={{
                      display: 'inline-block',
                      background: '#d1fae5',
                      color: '#065f46',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      marginBottom: '0.5rem'
                    }}>
                      🎯 Matches Your Skill!
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0', color: '#1f2937' }}>{req.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem', lineHeight: '1.4' }}>{req.description}</p>

                  {/* Requester Contact Details when Offer Accepted */}
                  {isOffered && req.creator_email && (
                    <div style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      marginBottom: '0.75rem',
                      fontSize: '0.85rem',
                      color: '#1e40af'
                    }}>
                      📩 <strong>Requester Contact:</strong> {req.creator_name} (<a href={`mailto:${req.creator_email}`} style={{ color: '#1d4ed8', textDecoration: 'underline' }}>{req.creator_email}</a>)
                    </div>
                  )}

                  {req.skill_required && (
                    <span style={{ fontSize: '0.8rem', background: '#f3f4f6', padding: '0.25rem 0.6rem', borderRadius: '6px', color: '#4b5563', display: 'inline-block', marginBottom: '1rem' }}>
                      💡 Skill Needed: <strong>{req.skill_required}</strong>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleOfferHelp(req.id)}
                  disabled={isOffered}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isOffered ? '#10b981' : 'var(--color-primary, #2563eb)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: isOffered ? 'default' : 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {isOffered ? '✓ Help Offered (In Progress)' : '🤝 Offer Help'}
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', marginBottom: '2.5rem', color: '#6b7280' }}>
          {filterMode === 'matching'
            ? 'No open requests match your profile skills currently. Switch to "All Requests" to see all community posts!'
            : 'No open requests from other community members right now.'}
        </div>
      )}

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
