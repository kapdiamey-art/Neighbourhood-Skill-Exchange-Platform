import { useState } from 'react'
import UserCard from '../components/UserCard'
import { mockUsers, neighborhoods } from '../data/mockData'
import './FindHelp.css'
import './Login.css' /* reuse form classes */

function FindHelp() {
  const [searchSkill, setSearchSkill] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All')
  const [selectedAvailability, setSelectedAvailability] = useState('All')

  const availabilityOptions = [
    'All', 'Weekdays', 'Weekends', 'Evenings',
    'Weekday Mornings', 'Weekday Afternoons', 'Anytime',
  ]

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSkill =
      searchSkill === '' ||
      user.skills.some((s) => s.toLowerCase().includes(searchSkill.toLowerCase())) ||
      user.profession.toLowerCase().includes(searchSkill.toLowerCase())

    const matchesNeighborhood =
      selectedNeighborhood === 'All' || user.neighborhood === selectedNeighborhood

    const matchesAvailability =
      selectedAvailability === 'All' || user.availability === selectedAvailability

    return matchesSkill && matchesNeighborhood && matchesAvailability
  })

  return (
    <div>
      <div className="find-help__header">
        <h1 className="find-help__title">Find Help</h1>
        <p className="find-help__subtitle">Search for skilled people in your neighbourhood</p>
      </div>

      {/* Filters */}
      <div className="find-help__filters">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="fh-search">Search Skill or Profession</label>
          <input
            id="fh-search"
            className="form-input"
            type="text"
            placeholder="e.g. Plumbing, React, Yoga…"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          />
        </div>
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
      </div>

      {/* Results */}
      <p className="find-help__results-count">
        <strong>{filteredUsers.length}</strong>{' '}
        {filteredUsers.length === 1 ? 'person' : 'people'} found
      </p>

      {filteredUsers.length > 0 ? (
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
      )}
    </div>
  )
}

export default FindHelp
