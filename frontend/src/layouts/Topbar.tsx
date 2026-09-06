import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import NotificationBell from '../components/Notifications/NotificationBell'
import './Topbar.css'

interface TopbarProps {
  onMenuClick?: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()

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
        <button
          className="topbar__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <NotificationBell />
      </div>
    </header>
  )
}
