import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Chatbot from '../components/Chatbot.jsx'
import './Dashboard.css'

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="zv-app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="zv-main-col">
        <Navbar />
        <main className="zv-main-content">
          <h1 className="zv-hero-title">AI Health Assistant</h1>
          <Chatbot />
        </main>
      </div>
    </div>
  )
}
