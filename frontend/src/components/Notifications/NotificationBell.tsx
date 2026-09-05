import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { api } from '../../services/api'
import type { Recommendation } from '../../types'
import './NotificationBell.css'

export default function NotificationBell() {
  const [recs, setRecs] = useState<Recommendation[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.getRecommendations()
      .then(data => setRecs(data))
      .catch(err => console.error('Failed to load notifications:', err))
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter high severity pending recommendations
  const highPendingAlerts = recs.filter(r => r.severity === 'High' && r.status === 'Pending')
  const unreadCount = highPendingAlerts.length

  const handleView = () => {
    setIsOpen(false)
    navigate('/recommendations')
  }

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="notification-bell__btn"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="View notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-bell__badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-bell__dropdown">
          <div className="notification-bell__header">
            <h3 className="notification-bell__title">Alerts & Notifications</h3>
            <span className="notification-bell__count">{unreadCount} High Pending</span>
          </div>

          <div className="notification-bell__list">
            {highPendingAlerts.length === 0 ? (
              <div className="notification-bell__empty">
                No high-severity pending alerts
              </div>
            ) : (
              highPendingAlerts.map(alert => (
                <div key={alert.id} className="notification-bell__item">
                  <div className="notification-bell__item-top">
                    <span className="notification-bell__mine">{alert.mine}</span>
                    <span className="badge badge--high">{alert.severity}</span>
                  </div>
                  <p className="notification-bell__item-title">{alert.title}</p>
                  <button className="notification-bell__view-btn" onClick={handleView}>
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
