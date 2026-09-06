import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CloudRain, Thermometer, Droplets } from 'lucide-react'
import { api } from '../services/api'
import { mines as fallbackMines, forecastRows as fallbackForecasts, recommendations as fallbackRecs } from '../data/synthetic'
import type { Mine, WeatherResult, ForecastRow, Recommendation } from '../types'
import Skeleton from '../components/Skeleton/Skeleton'
import './MineDetail.css'

export default function MineDetail() {
  const { id } = useParams<{ id: string }>()
  const [mine, setMine] = useState<Mine | null>(null)
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [forecast, setForecast] = useState<ForecastRow | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)

    Promise.allSettled([
      api.getMine(id),
      api.getWeather(id),
      api.getForecasts(),
      api.getRecommendations(),
    ]).then(([mineRes, weatherRes, forecastRes, recsRes]) => {
      // 1. Mine data
      let currentMine: Mine | null = null
      if (mineRes.status === 'fulfilled' && mineRes.value) {
        currentMine = mineRes.value as Mine
      } else {
        currentMine = fallbackMines.find(m => m.id === id || m.name.toLowerCase().includes(id.toLowerCase())) || fallbackMines[0]
      }
      setMine(currentMine)

      // 2. Weather data
      if (weatherRes.status === 'fulfilled' && weatherRes.value) {
        setWeather(weatherRes.value)
      } else {
        setWeather({
          avg_rainfall_mm: 18,
          avg_temperature_c: 28,
          avg_humidity_pct: 72,
          days_fetched: 7,
          source: 'Cached Fallback',
        })
      }

      // 3. Forecast data
      if (currentMine) {
        const mineNameClean = currentMine.name.toLowerCase().replace(' mine', '').trim()
        if (forecastRes.status === 'fulfilled' && forecastRes.value) {
          const matched = forecastRes.value.find(f => f.mine.toLowerCase().includes(mineNameClean))
          setForecast(matched || null)
        } else {
          const matched = fallbackForecasts.find(f => f.mine.toLowerCase().includes(mineNameClean))
          setForecast(matched || null)
        }

        // 4. Recommendations data
        if (recsRes.status === 'fulfilled' && recsRes.value) {
          const matchedRecs = recsRes.value.filter(r => r.mine.toLowerCase().includes(mineNameClean))
          setRecommendations(matchedRecs)
        } else {
          const matchedRecs = fallbackRecs.filter(r => r.mine.toLowerCase().includes(mineNameClean))
          setRecommendations(matchedRecs)
        }
      }
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="page mine-detail-page">
        <Link to="/mines" className="back-link">
          <ArrowLeft size={16} /> Back to Mines
        </Link>
        <Skeleton width="40%" height={32} borderRadius={8} />
        <div className="detail-grid">
          <Skeleton width="100%" height={160} borderRadius={12} />
          <Skeleton width="100%" height={160} borderRadius={12} />
          <Skeleton width="100%" height={160} borderRadius={12} />
          <Skeleton width="100%" height={160} borderRadius={12} />
        </div>
      </div>
    )
  }

  if (!mine) {
    return (
      <div className="page mine-detail-page">
        <Link to="/mines" className="back-link">
          <ArrowLeft size={16} /> Back to Mines
        </Link>
        <p>Mine not found.</p>
      </div>
    )
  }

  const variance = mine.actual - mine.monthlyTarget

  return (
    <div className="page mine-detail-page">
      <Link to="/mines" className="back-link">
        <ArrowLeft size={16} /> Back to Mines
      </Link>

      {/* Section 1: Mine Header */}
      <section className="mine-header-card">
        <div className="mine-header-top">
          <div>
            <div className="mine-title-row">
              <h1 className="mine-name">{mine.name}</h1>
              <span className={`badge badge--${mine.risk.toLowerCase()}`}>{mine.risk} Risk</span>
            </div>
            <p className="mine-state">State: {mine.state} • Coordinates: {mine.lat.toFixed(4)}°N, {mine.lng.toFixed(4)}°E</p>
          </div>
        </div>

        <div className="mine-stats-grid">
          <div className="mine-stat-box">
            <span className="stat-label">Monthly Target</span>
            <strong className="stat-value">{mine.monthlyTarget.toLocaleString()} <small>t</small></strong>
          </div>
          <div className="mine-stat-box">
            <span className="stat-label">Actual Production (MTD)</span>
            <strong className="stat-value">{mine.actual.toLocaleString()} <small>t</small></strong>
          </div>
          <div className="mine-stat-box">
            <span className="stat-label">Variance</span>
            <strong className={`stat-value ${variance >= 0 ? 'positive' : 'negative'}`}>
              {variance >= 0 ? '+' : ''}{variance.toLocaleString()} <small>t</small>
            </strong>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        {/* Section 2: Weather Card */}
        <section className="detail-card">
          <div className="card-header">
            <h3>Weather Telemetry (NASA POWER)</h3>
            <span className="card-sub">7-Day Moving Average</span>
          </div>
          {weather ? (
            <div className="weather-grid">
              <div className="weather-item">
                <CloudRain size={20} className="weather-icon rain" />
                <div>
                  <span className="weather-label">Avg Rainfall</span>
                  <strong className="weather-val">{weather.avg_rainfall_mm} mm</strong>
                </div>
              </div>
              <div className="weather-item">
                <Thermometer size={20} className="weather-icon temp" />
                <div>
                  <span className="weather-label">Avg Temperature</span>
                  <strong className="weather-val">{weather.avg_temperature_c} °C</strong>
                </div>
              </div>
              <div className="weather-item">
                <Droplets size={20} className="weather-icon humidity" />
                <div>
                  <span className="weather-label">Avg Humidity</span>
                  <strong className="weather-val">{weather.avg_humidity_pct} %</strong>
                </div>
              </div>
            </div>
          ) : (
            <p className="muted">No weather data available</p>
          )}
        </section>

        {/* Section 3: Forecast Card */}
        <section className="detail-card">
          <div className="card-header">
            <h3>Production Forecast</h3>
            <span className="card-sub">Multi-Horizon Analysis</span>
          </div>
          {forecast ? (
            <div className="forecast-content">
              <div className="forecast-horizons">
                <div className="horizon-box">
                  <span className="horizon-label">7-Day</span>
                  <strong className="horizon-val">{forecast.d7.toLocaleString()} t</strong>
                </div>
                <div className="horizon-box">
                  <span className="horizon-label">30-Day</span>
                  <strong className="horizon-val">{forecast.d30.toLocaleString()} t</strong>
                </div>
                <div className="horizon-box">
                  <span className="horizon-label">90-Day</span>
                  <strong className="horizon-val">{forecast.d90.toLocaleString()} t</strong>
                </div>
              </div>
              <div className="forecast-meta">
                <div className="meta-row">
                  <span className="meta-label">Forecast Risk:</span>
                  <span className={`badge badge--${forecast.risk.toLowerCase()}`}>{forecast.risk}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Primary Driver:</span>
                  <p className="meta-desc">{forecast.reason}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="muted">No forecast data available for this mine site</p>
          )}
        </section>
      </div>

      {/* Section 4: Recommendations */}
      <section className="detail-card">
        <div className="card-header">
          <h3>Mine Site Recommendations ({recommendations.length})</h3>
          <span className="card-sub">Actions requiring officer approval</span>
        </div>
        {recommendations.length > 0 ? (
          <div className="rec-grid">
            {recommendations.map(r => (
              <div key={r.id} className={`rec-item rec-item--${r.severity.toLowerCase()}`}>
                <div className="rec-item-top">
                  <span className={`badge badge--${r.severity.toLowerCase()}`}>{r.severity}</span>
                  <span className={`rec-status status--${r.status.toLowerCase()}`}>{r.status}</span>
                </div>
                <p className="rec-item-title">{r.title}</p>
                <p className="rec-item-reason">{r.reason}</p>
                <p className="rec-item-recovery">Expected Impact: {r.recovery}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted" style={{ padding: '16px 0' }}>No active recommendations generated for this mine site.</p>
        )}
      </section>
    </div>
  )
}
