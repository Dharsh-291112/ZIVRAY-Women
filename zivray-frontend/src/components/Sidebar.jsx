import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/records', label: 'My Health Vault', icon: '🗂️' },
  { to: '/insights', label: 'AI Insights', icon: '📊' },
  { to: '/appointments', label: 'Provider Hub', icon: '🩺' },
  { to: '/derma-test', label: 'Derma Test', icon: '🔍' },
]

export default function Sidebar({ open, onToggle }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <aside className={`zv-sidebar ${open ? 'zv-sidebar--open' : 'zv-sidebar--collapsed'}`}>
      <div className="zv-sidebar-top">
        <button className="zv-hamburger" onClick={onToggle} aria-label="Toggle sidebar">
          <span /><span /><span />
        </button>

        <div className="zv-profile-block">
          <button className="zv-avatar-btn" onClick={() => setMenuOpen((v) => !v)}>
            <div className="zv-avatar">{user?.full_name?.[0] || 'U'}</div>
          </button>

          {open && (
            <button className="zv-username" onClick={() => setMenuOpen((v) => !v)}>
              {user?.full_name || 'User'}
              <span className="zv-caret">▾</span>
            </button>
          )}

          {menuOpen && (
            <div className="zv-profile-dropdown">
              <NavLink to="/profile" className="zv-dropdown-item" onClick={() => setMenuOpen(false)}>
                My Profile
              </NavLink>
              <button className="zv-dropdown-item" onClick={() => alert('Account settings coming soon')}>
                Account Settings
              </button>
              <button className="zv-dropdown-item" onClick={() => alert('Privacy & permissions coming soon')}>
                Privacy & Permissions
              </button>
            </div>
          )}
        </div>
      </div>

      {open && (
        <nav className="zv-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} to={item.to} className="zv-sidebar-link">
              <span className="zv-sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      <div className="zv-sidebar-bottom">
        <button className="zv-sidebar-link zv-logout" onClick={logout}>
          <span className="zv-sidebar-icon">⏻</span>
          {open && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  )
}
