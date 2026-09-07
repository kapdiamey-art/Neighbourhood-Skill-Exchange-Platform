import { useState, useEffect } from 'react'
import UserCard from '../components/UserCard'
import { usersAPI, requestsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import './FindHelp.css'
import './Login.css'

function FindHelp() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab]         = useState('requests') // 'requests' | 'people'
  const [allUsers, setAllUsers]           = useState([])
  const [allRequests, setAllRequests]     = useState([])
  const [loading, setLoading]             = useState(true)
  const [searchSkill, setSearchSkill]     = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All')
  const [selectedAvailability, setSelectedAvailability] = useState('All')
  const [onlyMySkillMatch, setOnlyMySkillMatch]         = useState(false)
  const [offeredIds, setOfferedIds]       = useState([])

  useEffect(() => {
    Promise.all([usersAPI.getAll(), requestsAPI.getAll()])
      .then(([usersData, requestsData]) => {
        setAllUsers(usersData)
        setAllRequests(requestsData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const availabilityOptions = [
    'All', 'Weekdays', 'Weekends', 'Evenings',
    'Weekday Mornings', 'Weekday Afternoons', 'Anytime',
  ]

  // User's skills array
  const userSkillsArr = currentUser?.skills
    ? currentUser.skills.split(',').map((s) => s.trim().toLowerCase())
    : []

  const isSkillMatch = (req) => {
    if (!req.skill_required || userSkillsArr.length === 0) return false
    const reqSkill = req.skill_required.trim().toLowerCase()
    return userSkillsArr.some((s) => s.includes(reqSkill) || reqSkill.includes(s))
  }

  // Build unique neighborhood list from real data
  const neighborhoods = ['All', ...new Set(allUsers.map((u) => u.neighborhood).filter(Boolean))]

  // Filter requests
  const filteredRequests = allRequests.filter((req) => {
    // Hide user's own requests from community view if logged in
    if (currentUser && req.created_by === currentUser.id) return false

    if (onlyMySkillMatch && !isSkillMatch(req)) return false

    const matchesSkill =
      searchSkill === '' ||
      (req.skill_required || '').toLowerCase().includes(searchSkill.toLowerCase()) ||
      (req.title || '').toLowerCase().includes(searchSkill.toLowerCase()) ||
      (req.description || '').toLowerCase().includes(searchSkill.toLowerCase())

    return matchesSkill
  })

  // Filter users
  const filteredUsers = allUsers.filter((user) => {
    if (currentUser && user.id === currentUser.id) return false

    const skillsArr = user.skills ? user.skills.split(',').map((s) => s.trim()) : []

    const matchesSkill =
      searchSkill === '' ||
      skillsArr.some((s) => s.toLowerCase().includes(searchSkill.toLowerCase())) ||
      (user.profession || '').toLowerCase().includes(searchSkill.toLowerCase())

    const matchesNeighborhood =
      selectedNeighborhood === 'All' || user.neighborhood === selectedNeighborhood

    const matchesAvailability =
      selectedAvailability === 'All' || user.availability === selectedAvailability

    return matchesSkill && matchesNeighborhood && matchesAvailability
  })

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
      <div className="find-help__header">
        <h1 className="find-help__title">Find Help & Community Requests</h1>
        <p className="find-help__subtitle">Browse active help requests or search skilled neighbors</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '0.6rem 1.2rem',
            border: 'none',
            background: activeTab === 'requests' ? 'var(--color-primary, #2563eb)' : 'transparent',
            color: activeTab === 'requests' ? '#fff' : '#4b5563',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📋 Open Requests ({filteredRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('people')}
          style={{
            padding: '0.6rem 1.2rem',
            border: 'none',
            background: activeTab === 'people' ? 'var(--color-primary, #2563eb)' : 'transparent',
            color: activeTab === 'people' ? '#fff' : '#4b5563',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          👥 Skilled Neighbors ({filteredUsers.length})
        </button>
      </div>

      {/* Search Input & Skill Filter */}
      <div className="find-help__filters" style={{ gridTemplateColumns: activeTab === 'people' ? '2fr 1fr 1fr' : '1fr', marginBottom: '1.5rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className="form-label" htmlFor="fh-search" style={{ marginBottom: 0 }}>Search Skill, Keyword, or Title</label>
            {activeTab === 'requests' && currentUser && (
              <label style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <input
                  type="checkbox"
                  checked={onlyMySkillMatch}
                  onChange={(e) => setOnlyMySkillMatch(e.target.checked)}
                />
                🎯 Show only requests matching my skills
              </label>
            )}
          </div>
          <input
            id="fh-search"
            className="form-input"
            type="text"
            placeholder={activeTab === 'requests' ? "e.g. Python, Gardening, Plumbing…" : "e.g. Plumbing, React, Yoga…"}
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          />
        </div>
        {activeTab === 'people' && (
          <>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="fh-neighborhood">Neighborhood</label>
              <select
                id="fh-neighborhood"
                className="form-input form-input--select"
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
              >
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="fh-availability">Availability</label>
              <select
                id="fh-availability"
                className="form-input form-input--select"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
              >
                {availabilityOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted, #888)', padding: '1rem' }}>
          Loading community data…
        </p>
      ) : activeTab === 'requests' ? (
        /* Requests Grid */
        filteredRequests.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filteredRequests.map((req) => {
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
                  justify: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
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
          <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', textAlign: 'center', color: '#6b7280' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🔍</span>
            No open help requests found. Check back soon or refine your search.
          </div>
        )
      ) : (
        /* People Grid */
        filteredUsers.length > 0 ? (
          <div className="find-help__grid">
            {filteredUsers.map((user) => (
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
          <div className="find-help__empty">
            <span className="find-help__empty-icon">🔍</span>
            <p>No people match your filters. Try broadening your search.</p>
          </div>
        )
      )}
    </div>
  )
}

export default FindHelp
