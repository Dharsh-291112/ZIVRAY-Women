import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Loading from '../components/Loading.jsx'
import MedicalCard from '../components/MedicalCard.jsx'
import { fetchRecords, uploadRecord, fetchAnalytics } from '../services/medicalService.js'
import './Dashboard.css'

export default function MedicalRecords() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [records, setRecords] = useState([])
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ record_type: 'lab_report', title: '', file_url: '' })

  const loadAll = () => {
    setLoading(true)
    Promise.all([fetchRecords(), fetchAnalytics()])
      .then(([r, a]) => { setRecords(r); setAnalytics(a) })
      .finally(() => setLoading(false))
  }

  useEffect(loadAll, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await uploadRecord(form)
    setForm({ record_type: 'lab_report', title: '', file_url: '' })
    loadAll()
  }

  return (
    <div className="zv-app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="zv-main-col">
        <Navbar />
        <main className="zv-main-content">
          <h1 className="zv-hero-title">My Health Vault</h1>

          {loading ? <Loading /> : (
            <>
              <section id="upload" style={{ marginBottom: 28 }}>
                <h3 style={{ marginBottom: 10 }}>Upload New Document</h3>
                <form onSubmit={handleUpload} className="zv-panel-card" style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <select
                    className="zv-input"
                    value={form.record_type}
                    onChange={(e) => setForm({ ...form, record_type: e.target.value })}
                  >
                    <option value="lab_report">Lab Report</option>
                    <option value="prescription">Prescription</option>
                    <option value="imaging">Imaging</option>
                  </select>
                  <input
                    className="zv-input"
                    placeholder="Document title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                  <input
                    className="zv-input"
                    placeholder="File URL (optional)"
                    value={form.file_url}
                    onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                  />
                  <button className="zv-signin-btn" type="submit">Upload</button>
                </form>
              </section>

              <section style={{ marginBottom: 28 }}>
                <h3 style={{ marginBottom: 10 }}>History of Records</h3>
                <div className="zv-dash-grid">
                  {records.length === 0 && <p style={{ color: 'var(--zv-muted)' }}>No records uploaded yet.</p>}
                  {records.map((r) => <MedicalCard key={r.id} record={r} />)}
                </div>
              </section>

              <section id="analytics">
                <h3 style={{ marginBottom: 10 }}>Health Analytics</h3>
                <div className="zv-dash-grid">
                  {analytics.length === 0 && <p style={{ color: 'var(--zv-muted)' }}>No analytics recorded yet.</p>}
                  {analytics.map((a, i) => (
                    <div key={i} className="zv-panel-card">
                      <strong>{a.metric_name}</strong>
                      <p style={{ margin: '4px 0 0' }}>{a.metric_value}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--zv-muted)' }}>
                        {new Date(a.recorded_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
