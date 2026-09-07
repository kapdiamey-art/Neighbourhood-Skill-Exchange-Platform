import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import './CreateRequest.css'
import './Login.css'

function CreateRequest() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [form, setForm] = useState({
    title: '',
    skillRequired: '',
    description: '',
    urgency: 'Medium',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!currentUser) {
      setError('You must be logged in to create a request.')
      return
    }

    setLoading(true)
    try {
      // Call POST /api/requests/
      await requestsAPI.create({
        title:          form.title,
        description:    form.description,
        skill_required: form.skillRequired,
        urgency:        form.urgency,
        created_by:     currentUser.id,  // logged-in user's ID
      })
      navigate('/my-requests')
    } catch (err) {
      setError(err.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-request">
      <div className="create-request__card">
        <div className="create-request__icon">📝</div>
        <h1 className="create-request__title">Create Help Request</h1>
        <p className="create-request__subtitle">Tell your neighbours what you need</p>

        {!currentUser && (
          <div style={{ background: '#fef3cd', color: '#856404', padding: '0.75rem',
            borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            ⚠️ Please <a href="/login">log in</a> to submit a request.
          </div>
        )}

        {error && (
          <div style={{ color: '#ef4444', background: '#fef2f2', padding: '0.75rem',
            borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="cr-title">Request Title</label>
            <input id="cr-title" className="form-input" type="text" name="title"
              placeholder="e.g. Fix leaking kitchen tap" value={form.title}
              onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cr-skill">Skill Required</label>
            <input id="cr-skill" className="form-input" type="text" name="skillRequired"
              placeholder="e.g. Plumbing, Tutoring, Electrical" value={form.skillRequired}
              onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cr-desc">Description</label>
            <textarea id="cr-desc" className="form-input form-textarea" name="description"
              placeholder="Describe what you need help with…" value={form.description}
              onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Urgency</label>
            <div className="urgency-selector">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`urgency-btn urgency-btn--${level.toLowerCase()} ${
                    form.urgency === level ? 'urgency-btn--selected' : ''
                  }`}
                  onClick={() => setForm({ ...form, urgency: level })}
                >
                  {level === 'Low' && '📌 '}
                  {level === 'Medium' && '⚡ '}
                  {level === 'High' && '🚨 '}
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            style={{ marginTop: 'var(--space-4)' }}
            disabled={loading || !currentUser}
          >
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateRequest
