import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ notifications = [] }) {
  const [showPanel, setShowPanel] = useState(false)
  const hasUnread = notifications.some((n) => !n.is_read)

  return (
    <header className="zv-navbar">
      <div className="zv-navbar-spacer" />

      <div className="zv-navbar-actions">
        <Link to="/" className="zv-icon-btn" aria-label="Home">
          🏠
        </Link>

        <div className="zv-notif-wrap">
          <button
            className="zv-icon-btn"
            aria-label="Notifications"
            onClick={() => setShowPanel((v) => !v)}
          >
            🔔
            {hasUnread && <span className="zv-notif-dot" />}
          </button>

          {showPanel && (
            <div className="zv-notif-panel">
              {notifications.length === 0 && (
                <p className="zv-notif-empty">No notifications yet</p>
              )}
              {notifications.map((n) => (
                <div key={n.id} className={`zv-notif-item ${n.is_read ? '' : 'zv-notif-item--unread'}`}>
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
