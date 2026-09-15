import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginRequest } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'
import './Login.css'

export default function Login() {
  const [role, setRole] = useState('patient')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginRequest({ identifier, password, role })
      login(data.access_token, data.user)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="zv-login-page">
      <FigureColumn side="left" />

      <div className="zv-login-card">
        <h1 className="zv-brand">ZIVRAY</h1>
        <p className="zv-tagline">Your health. Your privacy. Your choice.</p>

        <div className="zv-login-as">
          <span className="zv-login-as-label">Login as</span>
          <div className="zv-toggle" role="tablist" aria-label="Login as">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'patient'}
              className={`zv-toggle-option ${role === 'patient' ? 'active' : ''}`}
              onClick={() => setRole('patient')}
            >
              Patient
            </button>
            <span className="zv-toggle-divider">|</span>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'doctor'}
              className={`zv-toggle-option ${role === 'doctor' ? 'active' : ''}`}
              onClick={() => setRole('doctor')}
            >
              Doctor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="zv-input"
            type="text"
            placeholder="Email / Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            className="zv-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="zv-error">{error}</p>}

          <button className="zv-signin-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="zv-links">
          <Link to="/forgot-password" className="zv-link">Forgot Password</Link>
          <span className="zv-link-sep">·</span>
          <Link to="/register" className="zv-link">Create Account</Link>
        </div>
      </div>

      <FigureColumn side="right" />
    </div>
  )
}

/**
 * Decorative illustrated silhouette column.
 * NOTE: this is an original abstract illustration (not a copy of any
 * specific artwork) built purely from CSS shapes so it's safe to ship.
 * Swap the background image below for your own licensed illustration
 * if you'd like an exact visual match to a reference file.
 */
function FigureColumn({ side }) {
  const figures = side === 'left'
    ? [0, 1, 2, 3, 4, 5]
    : [0, 1, 2, 3, 4, 5]

  return (
    <div className={`zv-figure-col zv-figure-col--${side}`} aria-hidden="true">
      {figures.map((i) => (
        <div key={i} className={`zv-silhouette zv-silhouette-${i % 4}`}>
          <div className="zv-silhouette-head" />
          <div className="zv-silhouette-body" />
        </div>
      ))}
      <div className="zv-sparkle zv-sparkle-1" />
      <div className="zv-sparkle zv-sparkle-2" />
      <div className="zv-sparkle zv-sparkle-3" />
    </div>
  )
}
