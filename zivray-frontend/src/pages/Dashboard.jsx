import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Loading from '../components/Loading.jsx'
import { fetchHomeSummary } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'
import './Dashboard.css'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchHomeSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="zv-app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div className="zv-main-col">
        <Navbar notifications={[]} />

        <main className="zv-main-content">
          {loading ? (
            <Loading label="Preparing your dashboard…" />
          ) : (
            <>
              <p className="zv-welcome-eyebrow">
                {summary?.greeting || 'Welcome'}, {summary?.full_name || user?.full_name}
              </p>
              <h1 className="zv-hero-title">Your Personal Health Sanctuary</h1>

              <div className="zv-dash-grid">
                <div className="zv-panel-card">
                  <h3>Upcoming Appointment</h3>
                  {summary?.next_appointment ? (
                    <>
                      <p style={{ margin: '4px 0 0' }}>
                        {summary.next_appointment.doctor_name || summary.next_appointment.patient_name}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--zv-muted)' }}>
                        {new Date(summary.next_appointment.scheduled_at).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p style={{ color: 'var(--zv-muted)', fontSize: '0.85rem' }}>Nothing scheduled yet.</p>
                  )}
                </div>

                <div className="zv-panel-card">
                  <h3>Last Visit</h3>
                  {summary?.last_appointment ? (
                    <>
                      <p style={{ margin: '4px 0 0' }}>
                        {summary.last_appointment.doctor_name || summary.last_appointment.patient_name}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--zv-muted)' }}>
                        {new Date(summary.last_appointment.scheduled_at).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p style={{ color: 'var(--zv-muted)', fontSize: '0.85rem' }}>No past visits on record.</p>
                  )}
                </div>
              </div>

              <p style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--zv-muted)' }}>
                Use the sidebar to open your Health Vault, AI Insights, or Provider Hub.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
