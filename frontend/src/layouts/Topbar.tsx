import { Menu } from 'lucide-react'
import NotificationBell from '../components/Notifications/NotificationBell'
import './Topbar.css'

interface TopbarProps {
  onMenuClick?: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__hamburger" onClick={onMenuClick} aria-label="Toggle navigation menu">
          <Menu size={20} />
        </button>
        <div className="topbar__identity">
          <h1 className="topbar__title">GeoMangan-AI</h1>
          <p className="topbar__subtitle">Reserve Intelligence Platform</p>
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__status" aria-label="System Status: Operational">
          <span className="topbar__status-dot" aria-hidden="true" />
          <span className="topbar__status-text">Operational</span>
        </div>
        <NotificationBell />
      </div>
    </header>
  )
}
