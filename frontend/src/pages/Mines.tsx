import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Mine } from '../types'
import './Mines.css'

export default function Mines() {
  const [mines, setMines] = useState<Mine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMines()
      .then((data) => setMines(data as Mine[]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: 24 }}>Loading...</p>

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mines</h1>
        <p className="page-desc">Active mine sites with current production status</p>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mine</th>
              <th>State</th>
              <th>Target (t)</th>
              <th>Actual (t)</th>
              <th>Variance</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {mines.map(m => {
              const variance = m.actual - m.monthlyTarget
              return (
                <tr key={m.id}>
                  <td className="muted">{m.id}</td>
                  <td className="bold">{m.name}</td>
                  <td>{m.state}</td>
                  <td>{m.monthlyTarget.toLocaleString()}</td>
                  <td>{m.actual.toLocaleString()}</td>
                  <td className={variance >= 0 ? 'positive' : 'negative'}>
                    {variance >= 0 ? '+' : ''}{variance.toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge badge--${m.risk.toLowerCase()}`}>{m.risk}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}