import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'
import './Login.css' /* reuse shared form classes */

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    neighborhood: '',
    profession: '',
    skills: '',
    availability: 'Weekdays',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    alert(
      `Registration data:\n` +
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Neighborhood: ${form.neighborhood}\n` +
      `Profession: ${form.profession}\n` +
      `Skills: ${form.skills}\n` +
      `Availability: ${form.availability}\n\n` +
      `(No backend connected yet)`
    )
  }

  return (
    <div className="register">
      <div className="register__card">
        <div className="register__icon">🚀</div>
        <h1 className="register__title">Create your account</h1>
        <p className="register__subtitle">Join your neighbourhood community today</p>

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

          <button type="submit" className="btn btn--primary">Create account</button>
        </form>

        <p className="register__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
