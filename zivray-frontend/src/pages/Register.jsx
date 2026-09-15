import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerRequest } from '../services/authService.js'
import '../pages/Login.css'

export default function Register() {
  const [role, setRole] = useState('patient')
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '',
    specialization: '', hospital_name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerRequest({ ...form, role })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="zv-login-page">
      <div className="zv-login-card" style={{ maxWidth: 380 }}>
        <h1 className="zv-brand">ZIVRAY</h1>
        <p className="zv-tagline">Create your account</p>

        <div className="zv-login-as">
          <span className="zv-login-as-label">I am a</span>
          <div className="zv-toggle">
            <button type="button" className={`zv-toggle-option ${role === 'patient' ? 'active' : ''}`} onClick={() => setRole('patient')}>Patient</button>
            <span className="zv-toggle-divider">|</span>
            <button type="button" className={`zv-toggle-option ${role === 'doctor' ? 'active' : ''}`} onClick={() => setRole('doctor')}>Doctor</button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input className="zv-input" placeholder="Full Name" value={form.full_name} onChange={update('full_name')} required />
          <input className="zv-input" type="email" placeholder="Email" value={form.email} onChange={update('email')} required />
          <input className="zv-input" placeholder="Phone" value={form.phone} onChange={update('phone')} />
          <input className="zv-input" type="password" placeholder="Password" value={form.password} onChange={update('password')} required />

          {role === 'doctor' && (
            <>
              <input className="zv-input" placeholder="Specialization" value={form.specialization} onChange={update('specialization')} />
              <input className="zv-input" placeholder="Hospital Name" value={form.hospital_name} onChange={update('hospital_name')} />
            </>
          )}

          {error && <p className="zv-error">{error}</p>}

          <button className="zv-signin-btn" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <div className="zv-links">
          <Link to="/login" className="zv-link">Already have an account? Sign In</Link>
        </div>
      </div>
    </div>
  )
}
