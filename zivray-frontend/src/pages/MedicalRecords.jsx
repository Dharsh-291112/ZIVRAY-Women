import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Loading from '../components/Loading.jsx'
import MedicalCard from '../components/MedicalCard.jsx'
import { addCycleEvent, fetchCycleEvents, fetchRecords, uploadRecord } from '../services/medicalService.js'
import './Dashboard.css'

export default function MedicalRecords() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [records, setRecords] = useState([])
  const [cycleEvents, setCycleEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ record_type: 'lab_report', title: '', file: null })
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [cycleForm, setCycleForm] = useState({ event_date: '', event_type: 'period', notes: '' })
  const [cycleError, setCycleError] = useState('')

  const loadAll = () => {
    setLoading(true)
    Promise.all([fetchRecords(), fetchCycleEvents()])
      .then(([r, cycle]) => {
        setRecords(r)
        setCycleEvents(cycle)
      })
      .finally(() => setLoading(false))
  }

  const handleCycleSubmit = async (e) => {
    e.preventDefault()
    setCycleError('')
    try {
      await addCycleEvent(cycleForm)
      setCycleForm({ event_date: '', event_type: 'period', notes: '' })
      setCycleEvents(await fetchCycleEvents())
    } catch (err) {
      setCycleError(err?.response?.data?.detail || 'Could not save health date')
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploadError('')
    if (!form.title.trim() || !form.file) return
    setUploading(true)
    try {
      await uploadRecord(form)
      setForm({ record_type: 'lab_report', title: '', file: null })
      e.currentTarget.reset()
      loadAll()
    } catch (err) {
      setUploadError(err?.response?.data?.detail || 'Could not upload document')
    } finally {
      setUploading(false)
    }
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
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                    onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                    required
                  />
                  {uploadError && <p className="zv-error">{uploadError}</p>}
                  <button className="zv-signin-btn" type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </form>
              </section>

              <section style={{ marginBottom: 28 }}>
                <h3 style={{ marginBottom: 10 }}>History of Records</h3>
                <div className="zv-dash-grid">
                  {records.length === 0 && <p style={{ color: 'var(--zv-muted)' }}>No records uploaded yet.</p>}
                  {records.map((r) => <MedicalCard key={r.id} record={r} />)}
                </div>
              </section>

              <section className="zv-cycle-section">
                <h3 style={{ marginBottom: 10 }}>Cycle and Pregnancy Calendar</h3>
                <div className="zv-vault-grid">
                  <CycleCalendar events={cycleEvents} />
                  <form onSubmit={handleCycleSubmit} className="zv-panel-card zv-cycle-form">
                    <strong>Add a personal health date</strong>
                    <input className="zv-input" type="date" value={cycleForm.event_date} onChange={(e) => setCycleForm({ ...cycleForm, event_date: e.target.value })} required />
                    <select className="zv-input" value={cycleForm.event_type} onChange={(e) => setCycleForm({ ...cycleForm, event_type: e.target.value })}>
                      <option value="period">Period day</option>
                      <option value="fertile_window">Fertile window</option>
                      <option value="pregnancy">Pregnancy milestone</option>
                    </select>
                    <input className="zv-input" placeholder="Optional note" value={cycleForm.notes} onChange={(e) => setCycleForm({ ...cycleForm, notes: e.target.value })} />
                    {cycleError && <p className="zv-error">{cycleError}</p>}
                    <button className="zv-signin-btn" type="submit">Save date</button>
                  </form>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function CycleCalendar({ events }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const days = new Date(year, monthIndex + 1, 0).getDate()
  const eventMap = events.reduce((map, event) => {
    const key = event.event_date.slice(0, 10)
    map[key] = [...(map[key] || []), event.event_type]
    return map
  }, {})

  return (
    <div className="zv-panel-card zv-calendar-card">
      <div className="zv-calendar-header">
        <button type="button" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))} aria-label="Previous month">‹</button>
        <strong>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong>
        <button type="button" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))} aria-label="Next month">›</button>
      </div>
      <div className="zv-calendar-grid zv-calendar-weekdays">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
      <div className="zv-calendar-grid">
        {Array.from({ length: firstDay }).map((_, index) => <span key={`empty-${index}`} />)}
        {Array.from({ length: days }, (_, index) => {
          const day = index + 1
          const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const types = eventMap[key] || []
          return <span key={key} className={`zv-calendar-day ${types.join(' ')}`} title={types.join(', ')}>{day}</span>
        })}
      </div>
      <div className="zv-calendar-legend"><span className="period-dot" /> Period <span className="fertile-dot" /> Fertile <span className="pregnancy-dot" /> Pregnancy</div>
    </div>
  )
}
