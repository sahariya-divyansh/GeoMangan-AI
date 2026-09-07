import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, AlertTriangle } from 'lucide-react'
import { subscribeAlerts, getAlertMines, type AlertMine } from '../../services/alertStore'
import './NotificationBell.css'


interface NotificationBellProps {
  alertCount?: number
}

export default function NotificationBell({ alertCount: propAlertCount }: NotificationBellProps) {
  const [alertMines, setAlertMines] = useState<AlertMine[]>(getAlertMines())
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = subscribeAlerts(alerts => {
      setAlertMines(alerts)
    })
    return unsubscribe
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

  const displayAlertCount = propAlertCount !== undefined ? propAlertCount : alertMines.length

  const handleView = () => {
    setIsOpen(false)
    navigate('/mines')
  }

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="notification-bell__btn"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="View notifications"
      >
        <Bell size={18} />
        {displayAlertCount > 0 && (
          <span className="notification-bell__badge">{displayAlertCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-bell__dropdown">
          <div className="notification-bell__header">
            <h3 className="notification-bell__title">Mine Status Alerts</h3>
            <span className="notification-bell__count">{displayAlertCount} Mine(s) in ALERT</span>
          </div>

          <div className="notification-bell__list">
            {alertMines.length === 0 ? (
              <div className="notification-bell__empty">
                All mines operating within target thresholds (&ge; 95%)
              </div>
            ) : (
              alertMines.map(alert => (
                <div key={alert.id} className="notification-bell__item notification-bell__item--alert">
                  <div className="notification-bell__item-top">
                    <div className="notification-bell__mine-group">
                      <AlertTriangle size={14} className="alert-icon" />
                      <span className="notification-bell__mine">{alert.name}</span>
                    </div>
                    <span className={`badge badge--${alert.risk.toLowerCase()}`}>{alert.risk} Risk</span>
                  </div>
                  <p className="notification-bell__item-detail">
                    Shortfall: <strong>{alert.shortfall.toLocaleString()} tonnes</strong>
                  </p>
                  <div className="notification-bell__item-meta">
                    Target: {alert.monthlyTarget.toLocaleString()} t | Actual: {alert.actual.toLocaleString()} t
                  </div>
                  <button className="notification-bell__view-btn" onClick={handleView}>
                    Inspect Mine
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
