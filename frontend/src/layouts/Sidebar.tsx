import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Factory,
  Map,
  Lightbulb,
  SlidersHorizontal,
  LayoutDashboard,
  Pickaxe,
  X,
} from 'lucide-react'
import './Sidebar.css'

const navigation = [
  { name: 'Dashboard',        path: '/dashboard',       icon: LayoutDashboard },
  { name: 'Mines',            path: '/mines',            icon: Factory },
  { name: 'Exploration',      path: '/exploration',      icon: Map },
  { name: 'Production',       path: '/production',       icon: BarChart3 },
  { name: 'Recommendations',  path: '/recommendations',  icon: Lightbulb },
  { name: 'What-if Simulator',path: '/whatif',           icon: SlidersHorizontal },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <div className="sidebar__logo-icon">
            <Pickaxe size={20} />
          </div>
          <div>
            <h1 className="sidebar__title">GeoMangan-AI</h1>
            <p className="sidebar__subtitle">Mining Intelligence Platform</p>
          </div>
        </div>
        {onClose && (
          <button className="sidebar__close-btn" onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="sidebar__nav">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar__footer">
        <p className="sidebar__footer-title">Decision Support System</p>
        <span className="sidebar__mode-badge">Synthetic data mode</span>
      </div>
    </aside>
  )
}