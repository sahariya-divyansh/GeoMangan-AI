import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { api } from '../services/api'
import type { ForecastRow, DiagnosisResult } from '../types'
import './Production.css'

const mineInputs: Record<string, { equipment: number; rainfall: number; blast: number; grade: number; target_grade: number }> = {
  'Balaghat Mine': { equipment: 0.82, rainfall: 18, blast: 1.5, grade: 38, target_grade: 37 },
  'Ukwa Mine':     { equipment: 0.91, rainfall: 8, blast: 0.5, grade: 40, target_grade: 37 },
  'Tirodi Mine':   { equipment: 0.78, rainfall: 32, blast: 2.5, grade: 36, target_grade: 37 },
  'Kandri Mine':   { equipment: 0.65, rainfall: 12, blast: 1.0, grade: 34, target_grade: 37 },
  'Munsar Mine':   { equipment: 0.88, rainfall: 6, blast: 0.8, grade: 39, target_grade: 37 },
}

export default function Production() {
  const [forecastRows, setForecastRows] = useState<ForecastRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMine, setExpandedMine] = useState<string | null>(null)
  const [diagnoses, setDiagnoses] = useState<Record<string, DiagnosisResult>>({})
  const [loadingDiag, setLoadingDiag] = useState<Record<string, boolean>>({})

  useEffect(() => {
    api.getForecasts()
      .then(data => setForecastRows(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleDiagnose = (f: ForecastRow) => {
    if (expandedMine === f.mine) {
      setExpandedMine(null)
      return
    }

    setExpandedMine(f.mine)

    if (!diagnoses[f.mine]) {
      const inputs = mineInputs[f.mine] || { equipment: 0.8, rainfall: 10, blast: 1, grade: 37, target_grade: 37 }
      setLoadingDiag(prev => ({ ...prev, [f.mine]: true }))

      api.diagnose({
        equipment_availability: inputs.equipment,
        rainfall_24h: inputs.rainfall,
        blasting_delay: inputs.blast,
        predicted_grade: inputs.grade,
        target_grade: inputs.target_grade,
        predicted: f.d30,
        target: f.target,
      })
        .then(res => setDiagnoses(prev => ({ ...prev, [f.mine]: res })))
        .catch(err => console.error(err))
        .finally(() => setLoadingDiag(prev => ({ ...prev, [f.mine]: false })))
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    )
  }

  const chartData = forecastRows.map(f => ({
    mine: f.mine.replace(' Mine', ''),
    Target: f.target,
    Forecast: f.d30,
  }))

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Production</h1>
        <p className="page-desc">Forecast vs target across 7, 30 and 90 day horizons</p>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="mine" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Target"   fill="#cbd5e1" radius={[4,4,0,0]} />
            <Bar dataKey="Forecast" fill="#16a34a" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Mine</th>
              <th>Monthly Target</th>
              <th>7-Day</th>
              <th>30-Day</th>
              <th>90-Day</th>
              <th>Risk</th>
              <th>Primary Cause</th>
              <th>Diagnosis</th>
            </tr>
          </thead>
          <tbody>
            {forecastRows.map(f => {
              const shortfall = f.d30 < f.target
              const isExpanded = expandedMine === f.mine
              const isLoading = loadingDiag[f.mine]
              const diag = diagnoses[f.mine]

              return (
                <>
                  <tr key={f.mine}>
                    <td className="bold">{f.mine}</td>
                    <td>{f.target.toLocaleString()}</td>
                    <td>{f.d7.toLocaleString()}</td>
                    <td className={shortfall ? 'negative' : 'positive'}>{f.d30.toLocaleString()}</td>
                    <td>{f.d90.toLocaleString()}</td>
                    <td><span className={`badge badge--${f.risk.toLowerCase()}`}>{f.risk}</span></td>
                    <td className="reason">{f.reason}</td>
                    <td>
                      <button
                        className={`btn-diagnose ${isExpanded ? 'btn-diagnose--active' : ''}`}
                        onClick={() => handleDiagnose(f)}
                      >
                        {isExpanded ? 'Hide' : 'Diagnose'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${f.mine}-diag`} className="diag-row">
                      <td colSpan={8}>
                        <div className="diag-panel">
                          {isLoading ? (
                            <span className="diag-loading">Diagnosing shortfall factors...</span>
                          ) : diag ? (
                            <div className="diag-content">
                              <div className="diag-metric">
                                <span className="diag-label">Shortfall Probability</span>
                                <span className="diag-prob">{diag.shortfall_probability}%</span>
                                <span className="diag-sub">({diag.shortfall_tonnes.toLocaleString()} t shortfall)</span>
                              </div>
                              <div className="diag-causes">
                                <div className="diag-cause-item">
                                  <span className="diag-cause-label">Primary Cause:</span>
                                  <span className="diag-cause-val">{diag.primary_reason}</span>
                                  <span className="diag-cause-pct">{diag.primary_contribution}%</span>
                                </div>
                                {diag.secondary_reason && (
                                  <div className="diag-cause-item">
                                    <span className="diag-cause-label">Secondary Cause:</span>
                                    <span className="diag-cause-val">{diag.secondary_reason}</span>
                                    <span className="diag-cause-pct">{diag.secondary_contribution}%</span>
                                  </div>
                                )}
                              </div>
                              <div className="diag-action">
                                <span className="diag-action-label">Suggested Action:</span>
                                <span className="diag-action-text">{diag.suggested_action}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="diag-loading">No diagnosis data available</span>
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
    </div>
  )
}