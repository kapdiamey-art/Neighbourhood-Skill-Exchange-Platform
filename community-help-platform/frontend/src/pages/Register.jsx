import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import './Register.css'
import './Login.css'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    neighborhood: '',
    profession: '',
    skills: '',
    availability: 'Weekdays',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call POST /api/auth/register
      const newUser = await authAPI.register(form)
      // Store user in AuthContext + localStorage
      login(newUser)
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register">
      <div className="register__card">
        <div className="register__icon">🚀</div>
        <h1 className="register__title">Create your account</h1>
        <p className="register__subtitle">Join your neighbourhood community today</p>

        {error && (
          <div style={{ color: 'var(--color-danger, #ef4444)', marginBottom: '1rem',
            background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="register__row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input id="reg-name" className="form-input" type="text" name="name"
                placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <input id="reg-email" className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="register__row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input id="reg-password" className="form-input" type="password" name="password"
                placeholder="Create a password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-neighborhood">Neighborhood</label>
              <input id="reg-neighborhood" className="form-input" type="text" name="neighborhood"
                placeholder="e.g. Kothrud, Pune" value={form.neighborhood} onChange={handleChange} required />
            </div>
          </div>

          <div className="register__row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-profession">Profession</label>
              <input id="reg-profession" className="form-input" type="text" name="profession"
                placeholder="e.g. Web Developer" value={form.profession} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-availability">Availability</label>
              <select id="reg-availability" className="form-input form-input--select" name="availability"
                value={form.availability} onChange={handleChange}>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="Weekday Mornings">Weekday Mornings</option>
                <option value="Weekday Afternoons">Weekday Afternoons</option>
                <option value="Anytime">Anytime</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-skills">Skills (comma separated)</label>
            <input id="reg-skills" className="form-input" type="text" name="skills"
              placeholder="e.g. JavaScript, React, Node.js" value={form.skills} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="register__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
