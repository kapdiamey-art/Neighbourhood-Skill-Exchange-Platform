import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call POST /api/auth/login
      const userData = await authAPI.login({ email, password })
      // Store in AuthContext + localStorage
      login(userData)
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__icon">👋</div>
        <h1 className="login__title">Welcome back</h1>
        <p className="login__subtitle">Sign in to your Community Help account</p>

        {error && (
          <div style={{ color: 'var(--color-danger, #ef4444)', marginBottom: '1rem',
            background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="login__footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
