import { useEffect, useState } from 'react'
import { Download, AlertCircle } from 'lucide-react'
import { jsPDF } from 'jspdf'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { mines as initialMines } from '../data/synthetic'
import { api } from '../services/api'
import { setAlertMines } from '../services/alertStore'
import type { Mine, WeatherResult } from '../types'
import './Dashboard.css'

const trendData = [
  { month: 'Jan', Historical: 259400, Target: 268000 },
  { month: 'Feb', Historical: 271200, Target: 274000 },
  { month: 'Mar', Historical: 281800, Target: 286000 },
  { month: 'Apr', Historical: 287300, Target: 292000 },
  { month: 'May', Historical: 296900, Target: 301000 },
  { month: 'Jun', Historical: 286570, Forecast: 286570, ConfidenceBand: [Math.round(286570 * 0.92), Math.round(286570 * 1.08)], Target: 292500 },
  { month: 'Jul', Forecast: 298000, ConfidenceBand: [Math.round(298000 * 0.92), Math.round(298000 * 1.08)], Target: 300000 },
  { month: 'Aug', Forecast: 285000, ConfidenceBand: [Math.round(285000 * 0.92), Math.round(285000 * 1.08)], Target: 295000 },
  { month: 'Sep', Forecast: 302000, ConfidenceBand: [Math.round(302000 * 0.92), Math.round(302000 * 1.08)], Target: 310000 },
]

const formatTonnes = (value: number) => value.toLocaleString('en-IN')

const getTotal = (items: Mine[], field: 'monthlyTarget' | 'actual') =>
  items.reduce((total, mine) => total + mine[field], 0)

export default function Dashboard() {
  const [minesList, setMinesList] = useState<Mine[]>(initialMines)
  const [selectedMine, setSelectedMine] = useState<string>('mn-balaghat')
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true)
  const [weatherFallback, setWeatherFallback] = useState<boolean>(false)

  const fetchMines = () => {
    api.getMines()
      .then((data) => {
        if (data && data.length > 0) {
          setMinesList(data)
          setAlertMines(data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch real-time mines:', err)
        setAlertMines(initialMines)
      })
  }

  useEffect(() => {
    fetchMines()
    const interval = setInterval(fetchMines, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let isMounted = true
    setWeatherLoading(true)
    api
      .getWeather(selectedMine)
      .then((data) => {
        if (isMounted) {
          setWeather(data)
          setWeatherFallback(false)
          setWeatherLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setWeather({
            avg_rainfall_mm: 18,
            avg_temperature_c: 28,
            avg_humidity_pct: 72,
            days_fetched: 7,
            source: 'Cached Fallback',
          })
          setWeatherFallback(true)
          setWeatherLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [selectedMine])

  const totalMines = minesList.length
  const totalProduction = getTotal(minesList, 'actual')
  const totalTarget = getTotal(minesList, 'monthlyTarget')
  const alertMinesCount = minesList.filter(m => m.actual < m.monthlyTarget * 0.95).length
  const minesAtRisk = minesList.filter(
    (mine) => mine.risk === 'High' || mine.risk === 'Medium',
  ).length

  const stats = [
    {
      label: 'Total Mines',
      value: totalMines,
    },
    {
      label: 'Total Production MTD',
      value: formatTonnes(totalProduction),
    },
    {
      label: 'Total Target MTD',
      value: formatTonnes(totalTarget),
    },
    {
      label: 'Mines In Alert State',
      value: alertMinesCount,
      isAlert: alertMinesCount > 0,
    },
    {
      label: 'Mines At Risk',
      value: minesAtRisk,
    },
    {
      label: 'Equipment Alerts',
      value: 2,
    },
  ]

  const exportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('GeoMangan-AI — Dashboard Report', 14, 20)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const dateStr = `Date: ${new Date().toLocaleString('en-US')}`
    doc.text(dateStr, 14, 28)

    let y = 38

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('1. Key Metrics Overview', 14, y)
    y += 6

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Metric', 14, y)
    doc.text('Value', 120, y)
    doc.setLineWidth(0.5)
    doc.line(14, y + 2, 196, y + 2)
    y += 8

    doc.setFont('helvetica', 'normal')
    stats.forEach(st => {
      doc.text(String(st.label), 14, y)
      doc.text(String(st.value), 120, y)
      y += 6
    })

    y += 6

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('2. Mine Site Weather Telemetry', 14, y)
    y += 6

    const selectedMineObj = minesList.find(m => m.id === selectedMine) || minesList[0]
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Selected Mine: ${selectedMineObj.name}`, 14, y)
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.text('Rainfall (mm)', 14, y)
    doc.text('Temperature (°C)', 70, y)
    doc.text('Humidity (%)', 130, y)
    doc.line(14, y + 2, 196, y + 2)
    y += 8

    doc.setFont('helvetica', 'normal')
    if (weather) {
      doc.text(`${weather.avg_rainfall_mm} mm`, 14, y)
      doc.text(`${weather.avg_temperature_c} °C`, 70, y)
      doc.text(`${weather.avg_humidity_pct} %`, 130, y)
    } else {
      doc.text('N/A', 14, y)
      doc.text('N/A', 70, y)
      doc.text('N/A', 130, y)
    }
    y += 12

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('3. Active Mines Summary', 14, y)
    y += 6

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Mine', 14, y)
    doc.text('Target (t)', 60, y)
    doc.text('Actual (t)', 95, y)
    doc.text('Variance', 130, y)
    doc.text('Risk', 165, y)
    doc.line(14, y + 2, 196, y + 2)
    y += 8

    doc.setFont('helvetica', 'normal')
    minesList.forEach(m => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      const variance = m.actual - m.monthlyTarget
      const varStr = (variance >= 0 ? '+' : '') + variance.toLocaleString()
      doc.text(m.name, 14, y)
      doc.text(m.monthlyTarget.toLocaleString(), 60, y)
      doc.text(m.actual.toLocaleString(), 95, y)
      doc.text(varStr, 130, y)
      doc.text(m.risk, 165, y)
      y += 7
    })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(128, 128, 128)
    doc.text('Prototype — live synthetic telemetry', 14, 285)

    doc.save('geomangan-dashboard-report.pdf')
  }

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>Dashboard</h2>
          <p>System overview across all active mines</p>
        </div>
        <button className="btn-export-report" onClick={exportPDF}>
          <Download size={14} />
          Export Report
        </button>
      </div>

      <div className="dashboard__stats">
        {stats.map((stat) => (
          <article className={`dashboard__stat-card ${stat.isAlert ? 'dashboard__stat-card--alert' : ''}`} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <section className="dashboard__mines-status">
        <h3 className="mines-status__title">Mine Status & Performance Telemetry</h3>
        <div className="mines-status__grid">
          {minesList.map((m) => {
            const isAlert = m.actual < m.monthlyTarget * 0.95
            const variance = m.actual - m.monthlyTarget
            const pct = Math.round((m.actual / m.monthlyTarget) * 100)

            return (
              <div key={m.id} className={`mine-card ${isAlert ? 'mine-card--alert' : ''}`}>
                <div className="mine-card__header">
                  <div className="mine-card__title-group">
                    <span className="mine-card__name">{m.name}</span>
                    {isAlert && (
                      <span className="alert-badge">
                        <AlertCircle size={12} />
                        ALERT
                      </span>
                    )}
                  </div>
                  <span className={`badge badge--${m.risk.toLowerCase()}`}>{m.risk}</span>
                </div>
                <div className="mine-card__body">
                  <div className="mine-card__metric">
                    <span className="metric-label">Target:</span>
                    <span className="metric-val">{m.monthlyTarget.toLocaleString()} t</span>
                  </div>
                  <div className="mine-card__metric">
                    <span className="metric-label">Actual:</span>
                    <span className="metric-val">{m.actual.toLocaleString()} t ({pct}%)</span>
                  </div>
                  <div className="mine-card__metric">
                    <span className="metric-label">Variance:</span>
                    <span className={`metric-val ${variance >= 0 ? 'positive' : 'negative'}`}>
                      {variance >= 0 ? '+' : ''}{variance.toLocaleString()} t
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="dashboard__weather-panel" aria-label="Weather metrics">
        <div className="weather-panel__header">
          <div className="weather-panel__title-group">
            <h3>Mine Site Weather (7-Day Average)</h3>
            {weatherLoading ? (
              <span className="weather-badge weather-badge--loading">Fetching weather...</span>
            ) : weatherFallback ? (
              <span className="weather-badge weather-badge--fallback">Weather data unavailable — using cached values</span>
            ) : (
              <span className="weather-badge weather-badge--live">Live — NASA POWER API</span>
            )}
          </div>
          <div className="weather-panel__select-group">
            <label htmlFor="weather-mine-select">Select Mine: </label>
            <select
              id="weather-mine-select"
              value={selectedMine}
              onChange={(e) => setSelectedMine(e.target.value)}
              className="weather-select"
            >
              {minesList.map((mine) => (
                <option key={mine.id} value={mine.id}>
                  {mine.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {weatherLoading ? (
          <div className="weather-panel__loading">Loading weather telemetry...</div>
        ) : weather ? (
          <div className="weather-panel__cards">
            <article className="weather-card">
              <span className="weather-card__label">Avg Rainfall</span>
              <strong className="weather-card__value">
                {weather.avg_rainfall_mm} <small>mm</small>
              </strong>
            </article>
            <article className="weather-card">
              <span className="weather-card__label">Avg Temperature</span>
              <strong className="weather-card__value">
                {weather.avg_temperature_c} <small>°C</small>
              </strong>
            </article>
            <article className="weather-card">
              <span className="weather-card__label">Avg Humidity</span>
              <strong className="weather-card__value">
                {weather.avg_humidity_pct} <small>%</small>
              </strong>
            </article>
          </div>
        ) : null}
      </section>

      <section className="dashboard__chart-panel" aria-label="Monthly production trend & 90-day forecast chart">
        <div className="chart-panel__header">
          <div>
            <h3>Production Trend & 90-Day Forecast</h3>
            <p className="chart-panel__subtitle">Historical actuals (Jan-Jun) vs Predictive Forecast (Jul-Sep)</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              domain={[240000, 340000]}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
              formatter={(value: any, name?: any) => {
                if (Array.isArray(value)) {
                  return [`${value[0].toLocaleString()} - ${value[1].toLocaleString()} t`, 'Confidence Band (92-108%)']
                }
                return [`${Number(value).toLocaleString()} t`, String(name || '')]
              }}
            />

            <Legend verticalAlign="top" height={36} />
            <Area
              type="monotone"
              dataKey="ConfidenceBand"
              name="Confidence Band"
              fill="#3b82f6"
              fillOpacity={0.15}
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="Historical"
              name="Historical"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Forecast"
              name="Forecast"
              stroke="#2563eb"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <ReferenceLine
              x="Jun"
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{ value: 'Today', fill: '#ef4444', position: 'top', fontSize: 12, fontWeight: 'bold' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </section>
    </section>
  )
}
