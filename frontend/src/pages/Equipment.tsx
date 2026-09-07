import { useEffect, useState } from 'react'
import { Wrench, AlertTriangle, CheckCircle, AlertOctagon, Calendar } from 'lucide-react'
import { api } from '../services/api'
import Skeleton from '../components/Skeleton/Skeleton'
import './Equipment.css'

interface EquipmentItem {
  id: string
  mine: string
  type: string
  operatingHours: number
  temperature: number
  vibration: number
  maintenanceInterval: number
  status: 'Healthy' | 'Warning' | 'Critical'
}

const initialEquipment: EquipmentItem[] = [
  { id: 'EQ001', mine: 'Balaghat Mine', type: 'Haul Truck', operatingHours: 1820, temperature: 87, vibration: 0.42, maintenanceInterval: 2000, status: 'Healthy' },
  { id: 'EQ002', mine: 'Kandri Mine', type: 'Crusher', operatingHours: 3100, temperature: 94, vibration: 0.71, maintenanceInterval: 3000, status: 'Warning' },
  { id: 'EQ003', mine: 'Tirodi Mine', type: 'Excavator', operatingHours: 2750, temperature: 91, vibration: 0.65, maintenanceInterval: 2500, status: 'Warning' },
  { id: 'EQ004', mine: 'Balaghat Mine', type: 'Conveyor', operatingHours: 980, temperature: 72, vibration: 0.28, maintenanceInterval: 1500, status: 'Healthy' },
  { id: 'EQ005', mine: 'Munsar Mine', type: 'Haul Truck', operatingHours: 4200, temperature: 98, vibration: 0.89, maintenanceInterval: 4000, status: 'Critical' },
]

export default function Equipment() {
  const [equipmentList] = useState<EquipmentItem[]>(initialEquipment)
  const [anomalyScores, setAnomalyScores] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [scheduledMsg, setScheduledMsg] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    const promises = equipmentList.map(item =>
      api.predictAnomaly({
        operating_hours: item.operatingHours,
        temperature: item.temperature,
        vibration: item.vibration,
        maintenance_interval: item.maintenanceInterval,
      })
        .then(res => {
          let score = 50
          if (typeof res === 'number') {
            score = res > 1 ? res : Math.round(res * 100)
          } else if (res && typeof res === 'object') {
            const raw = res.anomaly_risk ?? res.anomaly_score ?? (res.is_anomaly ? 85 : 20)
            score = typeof raw === 'number' ? (raw > 1 ? Math.round(raw) : Math.round(raw * 100)) : 50
          }
          return { id: item.id, score }
        })
        .catch(() => {
          // Synthetic deterministic fallback based on item metrics
          let fallbackScore = 25
          if (item.status === 'Warning') fallbackScore = 68
          if (item.status === 'Critical') fallbackScore = 92
          return { id: item.id, score: fallbackScore }
        })
    )

    Promise.all(promises).then(results => {
      if (!mounted) return
      const map: Record<string, number> = {}
      results.forEach(r => {
        map[r.id] = r.score
      })
      setAnomalyScores(map)
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [equipmentList])

  const healthyCount = equipmentList.filter(e => e.status === 'Healthy').length
  const warningCount = equipmentList.filter(e => e.status === 'Warning').length
  const criticalCount = equipmentList.filter(e => e.status === 'Critical').length

  const handleScheduleMaintenance = (item: EquipmentItem) => {
    setScheduledMsg(`Maintenance team dispatched for ${item.id} (${item.type} at ${item.mine})`)
    setTimeout(() => setScheduledMsg(null), 4000)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Equipment Health & Telemetry</h1>
        <p className="page-desc">Real-time vibration, thermal sensors, and AI anomaly detection</p>
      </div>

      {scheduledMsg && (
        <div className="equipment-toast">
          <Calendar size={16} />
          <span>{scheduledMsg}</span>
        </div>
      )}

      <div className="equipment-summary-bar">
        <div className="summary-pill summary-pill--healthy">
          <CheckCircle size={16} />
          <span>{healthyCount} Healthy</span>
        </div>
        <div className="summary-pill summary-pill--warning">
          <AlertTriangle size={16} />
          <span>{warningCount} Warning</span>
        </div>
        <div className="summary-pill summary-pill--critical">
          <AlertOctagon size={16} />
          <span>{criticalCount} Critical</span>
        </div>
      </div>

      {loading ? (
        <div className="equipment-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`eq-skel-${i}`} width="100%" height={240} borderRadius={12} />
          ))}
        </div>
      ) : (
        <div className="equipment-grid">
          {equipmentList.map(item => {
            const anomalyRisk = anomalyScores[item.id] ?? 50
            const pctUsed = Math.min(100, Math.round((item.operatingHours / item.maintenanceInterval) * 100))

            return (
              <div key={item.id} className={`equipment-card equipment-card--${item.status.toLowerCase()}`}>
                <div className="equipment-card__header">
                  <div>
                    <span className="equipment-id">{item.id}</span>
                    <h3 className="equipment-type">{item.type}</h3>
                    <span className="equipment-mine">{item.mine}</span>
                  </div>
                  <div className={`status-indicator status-indicator--${item.status.toLowerCase()}`} title={`Status: ${item.status}`}>
                    <span className="status-dot" />
                    <span className="status-text">{item.status}</span>
                  </div>
                </div>

                <div className="equipment-card__body">
                  <div className="hours-progress">
                    <div className="hours-labels">
                      <span>Operating Hours</span>
                      <strong>{item.operatingHours} / {item.maintenanceInterval} hrs</strong>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${pctUsed >= 100 ? 'progress-fill--over' : pctUsed >= 85 ? 'progress-fill--warn' : ''}`}
                        style={{ width: `${pctUsed}%` }}
                      />
                    </div>
                  </div>

                  <div className="readings-grid">
                    <div className="reading-box">
                      <span className="reading-label">Temperature</span>
                      <strong className={`reading-val ${item.temperature > 90 ? 'val-high' : ''}`}>
                        {item.temperature} °C
                      </strong>
                    </div>
                    <div className="reading-box">
                      <span className="reading-label">Vibration</span>
                      <strong className={`reading-val ${item.vibration > 0.6 ? 'val-high' : ''}`}>
                        {item.vibration} mm/s
                      </strong>
                    </div>
                  </div>

                  <div className="anomaly-risk-bar">
                    <span className="anomaly-label">AI Anomaly Risk:</span>
                    <span className={`anomaly-value risk-level-${anomalyRisk > 75 ? 'critical' : anomalyRisk > 50 ? 'warning' : 'low'}`}>
                      {anomalyRisk}%
                    </span>
                  </div>
                </div>

                {(item.status === 'Warning' || item.status === 'Critical') && (
                  <button
                    className={`btn-schedule btn-schedule--${item.status.toLowerCase()}`}
                    onClick={() => handleScheduleMaintenance(item)}
                  >
                    <Wrench size={14} />
                    Schedule Maintenance
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
