import { useEffect, useState, Fragment } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { X, Layers } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { api } from '../services/api'
import type { ProspectivityZone } from '../types'
import Skeleton from '../components/Skeleton/Skeleton'
import 'leaflet/dist/leaflet.css'
import './Exploration.css'

function getColor(score: number) {
  if (score > 80) return '#2ea043'
  if (score > 60) return '#d29922'
  return '#da3633'
}

function getDrillingRec(score: number) {
  if (score > 80) return 'Priority drilling recommended'
  if (score > 60) return 'Verify with ground survey first'
  return 'Low priority - monitor only'
}

export default function Exploration() {
  const [zones, setZones] = useState<ProspectivityZone[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState<ProspectivityZone | null>(null)
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null)
  const [explanations, setExplanations] = useState<Record<string, { feature: string; impact: number }[]>>({})
  const [loadingExplain, setLoadingExplain] = useState<Record<string, boolean>>({})

  useEffect(() => {
    api.getZones()
      .then((data) => setZones(data as ProspectivityZone[]))
      .finally(() => setLoading(false))
  }, [])

  const fetchShapIfNeeded = (z: ProspectivityZone) => {
    if (!explanations[z.id]) {
      setLoadingExplain(prev => ({ ...prev, [z.id]: true }))
      api.explainZone({
        ndvi: z.ndvi,
        iron_index: z.ironIndex,
        slope: 12.0,
        elevation: 450.0,
        lineament_density: 0.5,
        distance_to_deposit: 3.0,
      })
        .then((res) => {
          setExplanations(prev => ({ ...prev, [z.id]: res }))
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setLoadingExplain(prev => ({ ...prev, [z.id]: false }))
        })
    }
  }

  const handleSelectZone = (z: ProspectivityZone) => {
    setSelectedZone(z)
    fetchShapIfNeeded(z)
  }

  const handleExplainInline = (z: ProspectivityZone) => {
    if (expandedZoneId === z.id) {
      setExpandedZoneId(null)
      return
    }
    setExpandedZoneId(z.id)
    fetchShapIfNeeded(z)
  }

  const activeFactors = selectedZone ? (explanations[selectedZone.id] || []).slice(0, 3) : []

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Exploration</h1>
        <p className="page-desc">Prospectivity scores from satellite spectral indicators & AI explainability</p>
      </div>

      <div className="map-wrapper">
        {loading ? (
          <Skeleton width="100%" height="100%" borderRadius={12} />
        ) : (
          <MapContainer center={[21.7, 79.9]} zoom={8} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="OpenStreetMap"
            />
            {zones.map(z => (
              <CircleMarker
                key={z.id}
                center={[z.lat, z.lng]}
                radius={14}
                pathOptions={{ color: getColor(z.score), fillColor: getColor(z.score), fillOpacity: 0.6 }}
                eventHandlers={{
                  click: () => handleSelectZone(z),
                }}
              >
                <Popup>
                  <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                    <strong>{z.id}</strong><br />
                    Score: {z.score}<br />
                    Confidence: {z.confidence}<br />
                    <button
                      style={{
                        marginTop: 6,
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 11,
                      }}
                      onClick={() => handleSelectZone(z)}
                    >
                      View Details Panel
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Zone ID</th>
              <th>Mine ID</th>
              <th>Score</th>
              <th>Confidence</th>
              <th>NDVI</th>
              <th>Iron Index</th>
              <th>Recommended Action</th>
              <th>Explainability</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-exp-${i}`}>
                    <td><Skeleton width={60} height={16} /></td>
                    <td><Skeleton width={90} height={16} /></td>
                    <td><Skeleton width={70} height={16} /></td>
                    <td><Skeleton width={65} height={20} borderRadius={999} /></td>
                    <td><Skeleton width={40} height={16} /></td>
                    <td><Skeleton width={40} height={16} /></td>
                    <td><Skeleton width={120} height={16} /></td>
                    <td><Skeleton width={70} height={24} borderRadius={6} /></td>
                  </tr>
                ))
              : zones.map(z => {
                  const isExpanded = expandedZoneId === z.id
                  const isLoadingExplain = loadingExplain[z.id]
                  const factors = explanations[z.id]

                  return (
                    <Fragment key={z.id}>
                      <tr className={selectedZone?.id === z.id ? 'row-selected' : ''}>
                        <td className="muted">
                          <button className="zone-link-btn" onClick={() => handleSelectZone(z)}>
                            {z.id}
                          </button>
                        </td>
                        <td>{z.mineId}</td>
                        <td>
                          <div className="score-cell">
                            <div className="score-bar">
                              <div className="score-fill" style={{ width: `${z.score}%`, background: getColor(z.score) }} />
                            </div>
                            <span>{z.score}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge--${z.confidence.toLowerCase()}`}>{z.confidence}</span>
                        </td>
                        <td>{z.ndvi}</td>
                        <td>{z.ironIndex}</td>
                        <td className="action-cell">{z.action}</td>
                        <td>
                          <button
                            className={`btn-explain ${isExpanded ? 'btn-explain--active' : ''}`}
                            onClick={() => handleExplainInline(z)}
                          >
                            {isExpanded ? 'Hide' : 'Explain'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="explain-row">
                          <td colSpan={8}>
                            <div className="explain-panel">
                              <span className="explain-title">Top 3 Contributing Factors (SHAP AI):</span>
                              {isLoadingExplain ? (
                                <span className="explain-loading">Calculating SHAP impact values...</span>
                              ) : factors && factors.length > 0 ? (
                                <div className="explain-factors">
                                  {factors.slice(0, 3).map((item, idx) => (
                                    <span key={idx} className="factor-tag">
                                      <span className="factor-name">{item.feature}</span>
                                      <span className={`factor-val ${item.impact >= 0 ? 'pos' : 'neg'}`}>
                                        {item.impact >= 0 ? `+${item.impact}` : item.impact}
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="explain-loading">No feature impacts available</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
          </tbody>
        </table>
      </div>

      <p className="disclaimer">
        Prospectivity scores are exploration-prioritization estimates derived from
        satellite indicators. They do not constitute certified reserve figures and
        require field validation before operational use.
      </p>

      {/* Task 3 Slide-in Drawer Panel */}
      {selectedZone && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedZone(null)} aria-hidden="true" />
          <div className="zone-drawer" role="dialog" aria-modal="true">
            <div className="drawer-header">
              <div>
                <h3 className="drawer-title">{selectedZone.id}</h3>
                <p className="drawer-subtitle">Mine: {selectedZone.mineId}</p>
              </div>
              <button className="drawer-close-btn" onClick={() => setSelectedZone(null)} aria-label="Close detail panel">
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-score-card" style={{ borderColor: getColor(selectedZone.score) }}>
                <span className="drawer-score-label">Prospectivity Score</span>
                <div className="drawer-score-value" style={{ color: getColor(selectedZone.score) }}>
                  {selectedZone.score} <small>/ 100</small>
                </div>
                <span className={`badge badge--${selectedZone.confidence.toLowerCase()}`}>
                  {selectedZone.confidence} Confidence
                </span>
              </div>

              <div className="drawer-section">
                <h4 className="drawer-section-title">Satellite Indicators</h4>
                <div className="drawer-metrics-grid">
                  <div className="drawer-metric">
                    <span className="metric-name">NDVI Index</span>
                    <strong className="metric-num">{selectedZone.ndvi}</strong>
                  </div>
                  <div className="drawer-metric">
                    <span className="metric-name">Iron Index</span>
                    <strong className="metric-num">{selectedZone.ironIndex}</strong>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <h4 className="drawer-section-title">Recommended Action</h4>
                <p className="drawer-action-text">{selectedZone.action}</p>
              </div>

              <div className="drawer-section">
                <h4 className="drawer-section-title">SHAP Feature Explainability</h4>
                {loadingExplain[selectedZone.id] ? (
                  <div className="drawer-loading-shap">Calculating SHAP feature impacts...</div>
                ) : activeFactors.length > 0 ? (
                  <div className="shap-chart-wrapper">
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart
                        layout="vertical"
                        data={activeFactors}
                        margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                      >
                        <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                        <YAxis
                          type="category"
                          dataKey="feature"
                          tick={{ fontSize: 10, fill: 'var(--text-primary)' }}
                          width={75}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                          {activeFactors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.impact >= 0 ? '#16a34a' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="drawer-action-text">No SHAP breakdown cached</p>
                )}
              </div>

              <div className="drawer-section drawer-section--drilling">
                <h4 className="drawer-section-title">
                  <Layers size={16} /> Drilling Recommendation
                </h4>
                <div className={`drilling-recommendation-box score-tier-${selectedZone.score > 80 ? 'high' : selectedZone.score > 60 ? 'mid' : 'low'}`}>
                  {getDrillingRec(selectedZone.score)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}