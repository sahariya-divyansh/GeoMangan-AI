import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { mines } from '../data/synthetic'
import { api } from '../services/api'
import type { Mine, WeatherResult } from '../types'
import './Dashboard.css'

const monthlyData = [
  { month: 'Jan', Target: 268000, Actual: 259400 },
  { month: 'Feb', Target: 274000, Actual: 271200 },
  { month: 'Mar', Target: 286000, Actual: 281800 },
  { month: 'Apr', Target: 292000, Actual: 287300 },
  { month: 'May', Target: 301000, Actual: 296900 },
  { month: 'Jun', Target: 292500, Actual: 286570 },
]

const formatTonnes = (value: number) => value.toLocaleString('en-IN')

const getTotal = (items: Mine[], field: 'monthlyTarget' | 'actual') =>
  items.reduce((total, mine) => total + mine[field], 0)

export default function Dashboard() {
  const [selectedMine, setSelectedMine] = useState<string>('mn-balaghat')
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true)
  const [weatherFallback, setWeatherFallback] = useState<boolean>(false)

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

  const totalMines = mines.length
  const totalProduction = getTotal(mines, 'actual')
  const totalTarget = getTotal(mines, 'monthlyTarget')
  const minesAtRisk = mines.filter(
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
      label: 'Mines At Risk',
      value: minesAtRisk,
    },
    {
      label: 'High Prospectivity Zones',
      value: 7,
    },
    {
      label: 'Equipment Alerts',
      value: 2,
    },
  ]

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <h2>Dashboard</h2>
        <p>System overview across all active mines</p>
      </div>

      <div className="dashboard__stats">
        {stats.map((stat) => (
          <article className="dashboard__stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

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
              {mines.map((mine) => (
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

      <section className="dashboard__chart-panel" aria-label="Monthly production chart">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlyData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
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
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            <Line
              type="monotone"
              dataKey="Target"
              stroke="#94a3b8"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Actual"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </section>
  )
}
