import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { api } from '../services/api'
import type { ProspectivityZone } from '../types'
import 'leaflet/dist/leaflet.css'
import './Exploration.css'

function getColor(score: number) {
  if (score > 80) return '#2ea043'
  if (score > 60) return '#d29922'
  return '#da3633'
}

export default function Exploration() {
  const [zones, setZones] = useState<ProspectivityZone[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null)
  const [explanations, setExplanations] = useState<Record<string, { feature: string; impact: number }[]>>({})
  const [loadingExplain, setLoadingExplain] = useState<Record<string, boolean>>({})

  useEffect(() => {
    api.getZones()
      .then((data) => setZones(data as ProspectivityZone[]))
      .finally(() => setLoading(false))
  }, [])

  const handleExplain = (z: ProspectivityZone) => {
    if (expandedZoneId === z.id) {
      setExpandedZoneId(null)
      return
    }

    setExpandedZoneId(z.id)

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

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: 24 }}>Loading...</p>

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Exploration</h1>
        <p className="page-desc">Prospectivity scores from satellite spectral indicators</p>
      </div>

      <div className="map-wrapper">
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
              pathOptions={{ color: getColor(z.score), fillColor: getColor(z.score), fillOpacity: 0.5 }}
            >
              <Popup>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                  <strong>{z.id}</strong><br />
                  Score: {z.score}<br />
                  Confidence: {z.confidence}<br />
                  Action: {z.action}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
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
            {zones.map(z => {
              const isExpanded = expandedZoneId === z.id
              const isLoading = loadingExplain[z.id]
              const factors = explanations[z.id]

              return (
                <>
                  <tr key={z.id}>
                    <td className="muted">{z.id}</td>
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
                        onClick={() => handleExplain(z)}
                      >
                        {isExpanded ? 'Hide' : 'Explain'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${z.id}-explain`} className="explain-row">
                      <td colSpan={8}>
                        <div className="explain-panel">
                          <span className="explain-title">Top 3 Contributing Factors (SHAP AI):</span>
                          {isLoading ? (
                            <span className="explain-loading">Calculating SHAP impact values...</span>
                          ) : factors && factors.length > 0 ? (
                            <div className="explain-factors">
                              {factors.map((item, idx) => (
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
                </>
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
    </div>
  )
}