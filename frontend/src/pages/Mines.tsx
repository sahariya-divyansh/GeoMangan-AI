import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import type { Mine } from '../types'
import Skeleton from '../components/Skeleton/Skeleton'
import './Mines.css'

export default function Mines() {
  const [mines, setMines] = useState<Mine[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.getMines()
      .then((data) => setMines(data as Mine[]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mines</h1>
        <p className="page-desc">Active mine sites with current production status</p>
      </div>

      <div className="table-container">
        <table className="table table--clickable">
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
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    <td><Skeleton width={60} height={16} /></td>
                    <td><Skeleton width={130} height={16} /></td>
                    <td><Skeleton width={80} height={16} /></td>
                    <td><Skeleton width={90} height={16} /></td>
                    <td><Skeleton width={90} height={16} /></td>
                    <td><Skeleton width={80} height={16} /></td>
                    <td><Skeleton width={60} height={20} borderRadius={999} /></td>
                  </tr>
                ))
              : mines.map(m => {
                  const variance = m.actual - m.monthlyTarget
                  return (
                    <tr key={m.id} onClick={() => navigate(`/mines/${m.id}`)}>
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