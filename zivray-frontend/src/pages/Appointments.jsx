import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Loading from '../components/Loading.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import { fetchAppointments, bookAppointment } from '../services/appointmentService.js'
import { useAuth } from '../context/AuthContext.jsx'
import './Dashboard.css'

const suggestedDoctors = [
  { name: 'Dr. Alisha Patel', specialty: 'Obstetrics & Gynecology', rating: '4.9', reviews: '128', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=240&q=80', detail: 'Warm, thoughtful care for every stage of your journey.' },
  { name: 'Dr. Maya Chen', specialty: 'Endocrinology', rating: '4.8', reviews: '94', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=240&q=80', detail: 'Specialist in thyroid, hormone, and metabolic health.' },
  { name: 'Dr. Noor Ibrahim', specialty: 'Cardiology', rating: '4.9', reviews: '116', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=240&q=80', detail: 'Preventive heart care with a calm, clear approach.' },
]

export default function Appointments() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ doctor_id: '', scheduled_at: '', mode: 'in_person', notes: '' })
  const { user } = useAuth()

  const loadAll = () => {
    setLoading(true)
    fetchAppointments().then(setAppointments).finally(() => setLoading(false))
  }

  useEffect(loadAll, [])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!form.doctor_id || !form.scheduled_at) return
    await bookAppointment(form)
    setForm({ doctor_id: '', scheduled_at: '', mode: 'in_person', notes: '' })
    loadAll()
  }

  return (
    <div className="zv-app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="zv-main-col">
        <Navbar />
        <main className="zv-main-content">
          <h1 className="zv-hero-title">Provider Hub</h1>

          <section className="zv-doctor-section">
            <div className="zv-section-heading"><div><p className="zv-welcome-eyebrow">Care, matched to you</p><h3>Suggested doctors</h3></div><span className="zv-muted-text">Scroll to explore</span></div>
            <div className="zv-doctor-scroller">
              {suggestedDoctors.map((doctor) => (
                <article className="zv-doctor-card" key={doctor.name}>
                  <img src={doctor.image} alt={doctor.name} />
                  <div className="zv-doctor-info"><strong>{doctor.name}</strong><span>{doctor.specialty}</span><span className="zv-doctor-rating">★ {doctor.rating} <small>({doctor.reviews})</small></span></div>
                  <div className="zv-doctor-detail"><strong>{doctor.name}</strong><p>{doctor.detail}</p><span>Available for new patients</span></div>
                </article>
              ))}
            </div>
          </section>

          {user?.role === 'patient' && (
            <section style={{ marginBottom: 28 }}>
              <h3 style={{ marginBottom: 10 }}>Book Appointment</h3>
              <form onSubmit={handleBook} className="zv-panel-card" style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  className="zv-input"
                  placeholder="Doctor ID (from provider directory)"
                  value={form.doctor_id}
                  onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                  required
                />
                <input
                  className="zv-input"
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                  required
                />
                <select
                  className="zv-input"
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                >
                  <option value="in_person">In Person</option>
                  <option value="virtual">Virtual</option>
                </select>
                <input
                  className="zv-input"
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                <button className="zv-signin-btn" type="submit">Book Appointment</button>
              </form>
            </section>
          )}

          <section>
            <h3 style={{ marginBottom: 10 }}>Your Appointments</h3>
            {loading ? <Loading /> : (
              <div className="zv-dash-grid">
                {appointments.length === 0 && <p style={{ color: 'var(--zv-muted)' }}>No appointments yet.</p>}
                {appointments.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} viewerRole={user?.role} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
