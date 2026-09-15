import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'
import './Dashboard.css'

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuth()

  return (
    <div className="zv-app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="zv-main-col">
        <Navbar />
        <main className="zv-main-content">
          <h1 className="zv-hero-title">My Profile</h1>
          <div className="zv-panel-card" style={{ maxWidth: 420 }}>
            <p><strong>Name:</strong> {user?.full_name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone || '—'}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            {user?.role === 'doctor' && (
              <>
                <p><strong>Specialization:</strong> {user?.specialization || '—'}</p>
                <p><strong>Hospital:</strong> {user?.hospital_name || '—'}</p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
