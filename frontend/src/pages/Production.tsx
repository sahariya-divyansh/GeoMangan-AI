import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { api } from '../services/api'
import type { ForecastRow, DiagnosisResult, LSTMResult } from '../types'
import Skeleton from '../components/Skeleton/Skeleton'
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

  const [selectedModel, setSelectedModel] = useState<'Random Forest' | 'LSTM-MLP'>('Random Forest')
  const [lstmResult, setLstmResult] = useState<LSTMResult | null>(null)
  const [loadingLstm, setLoadingLstm] = useState(false)

  useEffect(() => {
    api.getForecasts()
      .then(data => setForecastRows(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedModel === 'LSTM-MLP' && !lstmResult) {
      setLoadingLstm(true)
      api.lstmForecast({
        equipment_availability: 0.82,
        rainfall: 18,
        blast_delay: 1.5,
        ore_grade: 38,
        working_days: 26,
        prev_month_production: 90250,
        month: new Date().getMonth() + 1,
      })
        .then(res => setLstmResult(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingLstm(false))
    }
  }, [selectedModel, lstmResult])

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

  const chartData = forecastRows.map(f => ({
    mine: f.mine.replace(' Mine', ''),
    Target: f.target,
    Forecast: f.d30,
  }))

  return (
    <div className="page">
      <div className="page-header page-header--flex">
        <div>
          <h1 className="page-title">Production</h1>
          <p className="page-desc">Forecast vs target across 7, 30 and 90 day horizons</p>
        </div>
        <div className="model-toggle">
          <button
            className={`btn-model ${selectedModel === 'Random Forest' ? 'btn-model--active' : ''}`}
            onClick={() => setSelectedModel('Random Forest')}
          >
            Random Forest
          </button>
          <button
            className={`btn-model ${selectedModel === 'LSTM-MLP' ? 'btn-model--active' : ''}`}
            onClick={() => setSelectedModel('LSTM-MLP')}
          >
            LSTM-MLP
          </button>
        </div>
      </div>

      <div className="chart-box">
        {loading ? (
          <Skeleton width="100%" height={240} borderRadius={8} />
        ) : (
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
        )}
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
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-prod-${i}`}>
                    <td><Skeleton width={110} height={16} /></td>
                    <td><Skeleton width={80} height={16} /></td>
                    <td><Skeleton width={70} height={16} /></td>
                    <td><Skeleton width={70} height={16} /></td>
                    <td><Skeleton width={70} height={16} /></td>
                    <td><Skeleton width={60} height={20} borderRadius={999} /></td>
                    <td><Skeleton width={140} height={16} /></td>
                    <td><Skeleton width={70} height={24} borderRadius={6} /></td>
                  </tr>
                ))
              : forecastRows.map(f => {
                  const shortfall = f.d30 < f.target
                  const isExpanded = expandedMine === f.mine
                  const isLoadingDiag = loadingDiag[f.mine]
                  const diag = diagnoses[f.mine]

                  return (
                    <tr key={f.mine} style={{ display: 'table-row-group' }}>
                      <tr key={`${f.mine}-main`}>
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
                              {isLoadingDiag ? (
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
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>

      {selectedModel === 'LSTM-MLP' && (
        <div className="lstm-panel">
          <div className="lstm-header">
            <div>
              <h3 className="lstm-title">LSTM-MLP Neural Network Forecast (Balaghat Mine Focus)</h3>
              <p className="lstm-desc">Deep multi-layer perceptron neural network prediction with 95% confidence intervals</p>
            </div>
            <span className="badge badge--lstm">LSTM-MLP</span>
          </div>

          {loadingLstm ? (
            <Skeleton width="100%" height={60} borderRadius={8} />
          ) : lstmResult ? (
            <div className="lstm-grid">
              <div className="lstm-card">
                <span className="lstm-label">Predicted Production</span>
                <span className="lstm-value">{lstmResult.predicted.toLocaleString()} t</span>
              </div>
              <div className="lstm-card">
                <span className="lstm-label">Confidence Interval (95% CI)</span>
                <span className="lstm-ci">
                  {lstmResult.confidence_interval[0].toLocaleString()} - {lstmResult.confidence_interval[1].toLocaleString()} t
                </span>
              </div>
              <div className="lstm-card">
                <span className="lstm-label">Operational Risk</span>
                <span className={`badge badge--${lstmResult.risk.toLowerCase()}`}>
                  {lstmResult.risk}
                </span>
              </div>
            </div>
          ) : (
            <p className="lstm-loading">No forecast data available</p>
          )}
        </div>
      )}
    </div>
  )
}