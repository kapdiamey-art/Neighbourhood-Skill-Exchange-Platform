import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { requestsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import './MyRequests.css'

function MyRequests() {
  const { currentUser } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMyRequests = () => {
    if (!currentUser) return
    requestsAPI.getMine(currentUser.id)
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }
    fetchMyRequests()
  }, [currentUser])

  const handleMarkCompleted = async (reqId) => {
    try {
      await requestsAPI.updateStatus(reqId, 'Completed')
      setRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: 'Completed' } : r))
      )
    } catch (err) {
      alert(err.message || 'Failed to mark as completed.')
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open':        return 'badge--open'
      case 'In Progress': return 'badge--in-progress'
      case 'Completed':   return 'badge--completed'
      default:            return ''
    }
  }

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'High':   return 'request-card__meta-item--danger'
      case 'Medium': return 'request-card__meta-item--warning'
      case 'Low':    return 'request-card__meta-item--success'
      default:       return ''
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  if (!currentUser) {
    return (
      <div>
        <div className="my-requests__header">
          <h1 className="my-requests__title">My Requests</h1>
        </div>
        <p style={{ padding: '1rem', color: '#888' }}>
          Please <Link to="/login">log in</Link> to see your requests.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="my-requests__header">
        <h1 className="my-requests__title">My Requests</h1>
        <p className="my-requests__subtitle">Track and manage your help requests</p>
      </div>

      {loading && <p style={{ color: '#888', padding: '1rem' }}>Loading your requests…</p>}
      {error   && <p style={{ color: '#ef4444', padding: '1rem' }}>{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p style={{ fontSize: '3rem' }}>📋</p>
          <p>You haven&apos;t posted any requests yet.</p>
          <Link to="/create-request" className="btn btn--primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Create your first request
          </Link>
        </div>
      )}

      <div className="my-requests__list">
        {requests.map((req) => (
          <div key={req.id} className="request-card">
            <div className="request-card__top">
              <span className="request-card__title">{req.title}</span>
              <span className={`badge ${getStatusClass(req.status)}`}>
                {req.status === 'In Progress' ? '⚡ In Progress (Helper Joined)' : req.status}
              </span>
            </div>

            <p className="request-card__desc">{req.description}</p>

            <div className="request-card__meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="request-card__meta-item">🛠️ {req.skill_required}</span>
                <span className={`request-card__meta-item ${getUrgencyClass(req.urgency)}`}>
                  {req.urgency === 'High' ? '🚨' : req.urgency === 'Medium' ? '⚡' : '📌'}{' '}
                  {req.urgency} Urgency
                </span>
                <span className="request-card__meta-item">📅 {formatDate(req.created_at)}</span>
              </div>

              {req.status === 'In Progress' && (
                <button
                  onClick={() => handleMarkCompleted(req.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  ✔ Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyRequests
