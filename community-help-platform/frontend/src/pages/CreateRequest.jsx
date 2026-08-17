import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateRequest.css'
import './Login.css'

function CreateRequest() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    skillRequired: '',
    description: '',
    urgency: 'Medium',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(
      `Request submitted!\n\n` +
      `Title: ${form.title}\n` +
      `Skill: ${form.skillRequired}\n` +
      `Urgency: ${form.urgency}\n` +
      `Description: ${form.description}\n\n` +
      `(No backend connected yet)`
    )
    navigate('/my-requests')
  }

  return (
    <div className="create-request">
      <div className="create-request__card">
        <div className="create-request__icon">📝</div>
        <h1 className="create-request__title">Create Help Request</h1>
        <p className="create-request__subtitle">Tell your neighbours what you need</p>

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

          <button type="submit" className="btn btn--primary" style={{ marginTop: 'var(--space-4)' }}>
            Submit Request
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateRequest
