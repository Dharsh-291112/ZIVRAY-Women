import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import { api } from '../services/api.js'
import './Dashboard.css'

export default function Emergency() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sent, setSent] = useState(false)

  const triggerAlert = async () => {
    await api.post('/emergency/alert')
    setSent(true)
  }

  return (
    <div className="zv-app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="zv-main-col">
        <Navbar />
        <main className="zv-main-content">
          <h1 className="zv-hero-title">Emergency</h1>
          <div className="zv-panel-card" style={{ maxWidth: 420 }}>
            <p>Trigger an emergency alert to notify nearby hospitals.</p>
            <button className="zv-signin-btn" onClick={triggerAlert} disabled={sent}>
              {sent ? 'Alert Sent' : 'Send Emergency Alert'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
