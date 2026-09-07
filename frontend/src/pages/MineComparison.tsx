import { useEffect, useState } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { api } from '../services/api'
import { mines as defaultMines } from '../data/synthetic'
import type { Mine, WeatherResult, ForecastRow } from '../types'

import Skeleton from '../components/Skeleton/Skeleton'
import './MineComparison.css'

interface ExtendedMineData {
  mine: Mine
  weather: WeatherResult | null
  forecast: ForecastRow | null
  recommendationsCount: number
  scores: {
    productionPct: number
    equipmentScore: number
    weatherScore: number
    gradeScore: number
    riskScore: number
  }
}

function getEquipmentScore(risk: string): number {
  if (risk === 'Low') return 90
  if (risk === 'Medium') return 65
  return 40
}

function getRiskScore(risk: string): number {
  if (risk === 'Low') return 90
  if (risk === 'Medium') return 60
  return 30
}

export default function MineComparison() {
  const [minesList, setMinesList] = useState<Mine[]>(defaultMines)
  const [mineAId, setMineAId] = useState<string>('mn-balaghat')
  const [mineBId, setMineBId] = useState<string>('mn-kandri')

  const [dataA, setDataA] = useState<ExtendedMineData | null>(null)
  const [dataB, setDataB] = useState<ExtendedMineData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    api.getMines()
      .then(res => {
        if (res && res.length > 0) setMinesList(res)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      api.getMine(mineAId).catch(() => defaultMines.find(m => m.id === mineAId) || defaultMines[0]),
      api.getMine(mineBId).catch(() => defaultMines.find(m => m.id === mineBId) || defaultMines[1]),
      api.getWeather(mineAId).catch(() => ({ avg_rainfall_mm: 18, avg_temperature_c: 28, avg_humidity_pct: 70, days_fetched: 7, source: 'Fallback' })),
      api.getWeather(mineBId).catch(() => ({ avg_rainfall_mm: 32, avg_temperature_c: 30, avg_humidity_pct: 78, days_fetched: 7, source: 'Fallback' })),
      api.getForecasts().catch(() => []),
      api.getRecommendations().catch(() => []),
    ]).then(([mA, mB, wA, wB, forecasts, recs]) => {
      if (!active) return

      const fA = forecasts.find(f => f.mine.toLowerCase().includes(mA.name.toLowerCase().split(' ')[0])) || null
      const fB = forecasts.find(f => f.mine.toLowerCase().includes(mB.name.toLowerCase().split(' ')[0])) || null

      const recsA = recs.filter(r => r.mine.toLowerCase().includes(mA.name.toLowerCase().split(' ')[0])).length
      const recsB = recs.filter(r => r.mine.toLowerCase().includes(mB.name.toLowerCase().split(' ')[0])).length

      const prodPctA = Math.min(100, Math.round((mA.actual / mA.monthlyTarget) * 100))
      const prodPctB = Math.min(100, Math.round((mB.actual / mB.monthlyTarget) * 100))

      const weatherScoreA = Math.max(0, Math.min(100, Math.round(100 - (wA?.avg_rainfall_mm || 0) * 1.2)))
      const weatherScoreB = Math.max(0, Math.min(100, Math.round(100 - (wB?.avg_rainfall_mm || 0) * 1.2)))

      setDataA({
        mine: mA,
        weather: wA,
        forecast: fA,
        recommendationsCount: recsA,
        scores: {
          productionPct: prodPctA,
          equipmentScore: getEquipmentScore(mA.risk),
          weatherScore: weatherScoreA,
          gradeScore: 75,
          riskScore: getRiskScore(mA.risk),
        },
      })

      setDataB({
        mine: mB,
        weather: wB,
        forecast: fB,
        recommendationsCount: recsB,
        scores: {
          productionPct: prodPctB,
          equipmentScore: getEquipmentScore(mB.risk),
          weatherScore: weatherScoreB,
          gradeScore: 75,
          riskScore: getRiskScore(mB.risk),
        },
      })

      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [mineAId, mineBId])

  const radarData = dataA && dataB ? [
    { subject: 'Production %', MineA: dataA.scores.productionPct, MineB: dataB.scores.productionPct, fullMark: 100 },
    { subject: 'Equipment Score', MineA: dataA.scores.equipmentScore, MineB: dataB.scores.equipmentScore, fullMark: 100 },
    { subject: 'Weather Score', MineA: dataA.scores.weatherScore, MineB: dataB.scores.weatherScore, fullMark: 100 },
    { subject: 'Grade Score', MineA: dataA.scores.gradeScore, MineB: dataB.scores.gradeScore, fullMark: 100 },
    { subject: 'Risk Score', MineA: dataA.scores.riskScore, MineB: dataB.scores.riskScore, fullMark: 100 },
  ] : []

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mine Comparison</h1>
        <p className="page-desc">Side-by-side performance, telemetry, and synthetic radar benchmarking</p>
      </div>

      <div className="comparison-selectors">
        <div className="selector-group">
          <label htmlFor="select-mine-a">Select Mine A (Green):</label>
          <select
            id="select-mine-a"
            value={mineAId}
            onChange={(e) => setMineAId(e.target.value)}
            className="mine-select mine-select--a"
          >
            {minesList.map(m => (
              <option key={`a-${m.id}`} value={m.id} disabled={m.id === mineBId}>
                {m.name} ({m.state})
              </option>
            ))}
          </select>
        </div>

        <div className="selector-group">
          <label htmlFor="select-mine-b">Select Mine B (Blue):</label>
          <select
            id="select-mine-b"
            value={mineBId}
            onChange={(e) => setMineBId(e.target.value)}
            className="mine-select mine-select--b"
          >
            {minesList.map(m => (
              <option key={`b-${m.id}`} value={m.id} disabled={m.id === mineAId}>
                {m.name} ({m.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading || !dataA || !dataB ? (
        <div className="comparison-loading">
          <Skeleton width="100%" height={320} borderRadius={12} />
          <Skeleton width="100%" height={280} borderRadius={12} />
        </div>
      ) : (
        <>
          <div className="comparison-grid">
            <div className="comparison-column comparison-column--a">
              <div className="mine-header-badge mine-header-badge--a">Mine A</div>
              
              <div className="comp-row">
                <span className="comp-label">Mine & State</span>
                <div className="comp-value">
                  <strong>{dataA.mine.name}</strong>
                  <span className="comp-sub">{dataA.mine.state}</span>
                  <span className={`badge badge--${dataA.mine.risk.toLowerCase()}`}>{dataA.mine.risk} Risk</span>
                </div>
              </div>

              <div className="comp-row">
                <span className="comp-label">Target vs Actual</span>
                <div className="comp-value">
                  <div>Target: {dataA.mine.monthlyTarget.toLocaleString()} t</div>
                  <div>Actual: {dataA.mine.actual.toLocaleString()} t</div>
                  <div className={dataA.mine.actual >= dataA.mine.monthlyTarget ? 'positive' : 'negative'}>
                    Variance: {dataA.mine.actual >= dataA.mine.monthlyTarget ? '+' : ''}
                    {(dataA.mine.actual - dataA.mine.monthlyTarget).toLocaleString()} t
                  </div>
                </div>
              </div>

              <div className="comp-row">
                <span className="comp-label">Weather Telemetry</span>
                <div className="comp-value">
                  {dataA.weather ? (
                    <>
                      <div>Rainfall: {dataA.weather.avg_rainfall_mm} mm</div>
                      <div>Temp: {dataA.weather.avg_temperature_c} °C | Humidity: {dataA.weather.avg_humidity_pct}%</div>
                    </>
                  ) : 'N/A'}
                </div>
              </div>

              <div className="comp-row">
                <span className="comp-label">30-Day Forecast</span>
                <div className="comp-value">
                  <strong>{dataA.forecast ? `${dataA.forecast.d30.toLocaleString()} t` : 'N/A'}</strong>
                  {dataA.forecast && <span className="comp-sub">{dataA.forecast.reason}</span>}
                </div>
              </div>

              <div className="comp-row">
                <span className="comp-label">Active Recommendations</span>
                <div className="comp-value">
                  <strong>{dataA.recommendationsCount} item(s)</strong>
                </div>
              </div>
            </div>

            <div className="comparison-column comparison-column--b">
              <div className="mine-header-badge mine-header-badge--b">Mine B</div>
              
              <div className="comp-row">
                <span className="comp-label">Mine & State</span>
                <div className="comp-value">
                  <strong>{dataB.mine.name}</strong>
                  <span className="comp-sub">{dataB.mine.state}</span>
                  <span className={`badge badge--${dataB.mine.risk.toLowerCase()}`}>{dataB.mine.risk} Risk</span>
                </div>
              </div>

              <div className="comp-row">
                <span className="comp-label">Target vs Actual</span>
                <div className="comp-value">
                  <div>Target: {dataB.mine.monthlyTarget.toLocaleString()} t</div>
                  <div>Actual: {dataB.mine.actual.toLocaleString()} t</div>
                  <div className={dataB.mine.actual >= dataB.mine.monthlyTarget ? 'positive' : 'negative'}>
                    Variance: {dataB.mine.actual >= dataB.mine.monthlyTarget ? '+' : ''}
                    {(dataB.mine.actual - dataB.mine.monthlyTarget).toLocaleString()} t
                  </div>
                </div>
              </div>

              <div className="comp-row">
                <span className="comp-label">Weather Telemetry</span>
                <div className="comp-value">
                  {dataB.weather ? (
                    <>
                      <div>Rainfall: {dataB.weather.avg_rainfall_mm} mm</div>
                      <div>Temp: {dataB.weather.avg_temperature_c} °C | Humidity: {dataB.weather.avg_humidity_pct}%</div>
                    </>
                  ) : 'N/A'}
                </div>
              </div>

              <div className="comp-row">
                <span className="comp-label">30-Day Forecast</span>
                <div className="comp-value">
                  <strong>{dataB.forecast ? `${dataB.forecast.d30.toLocaleString()} t` : 'N/A'}</strong>
                  {dataB.forecast && <span className="comp-sub">{dataB.forecast.reason}</span>}
                </div>
              </div>

              <div className="comp-row">
                <span className="comp-label">Active Recommendations</span>
                <div className="comp-value">
                  <strong>{dataB.recommendationsCount} item(s)</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="radar-section">
            <h3 className="radar-title">Multi-Axis Mine Performance Radar Benchmark</h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend />
                <Radar
                  name={`${dataA.mine.name} (Mine A)`}
                  dataKey="MineA"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.4}
                />
                <Radar
                  name={`${dataB.mine.name} (Mine B)`}
                  dataKey="MineB"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
