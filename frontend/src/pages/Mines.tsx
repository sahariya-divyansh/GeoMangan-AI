import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Filter, ArrowUpDown } from 'lucide-react'
import { api } from '../services/api'
import type { Mine } from '../types'
import Skeleton from '../components/Skeleton/Skeleton'
import './Mines.css'

export default function Mines() {
  const [mines, setMines] = useState<Mine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All')
  const [sortBy, setSortBy] = useState<'default' | 'target' | 'actual' | 'variance'>('default')

  const navigate = useNavigate()

  useEffect(() => {
    api.getMines()
      .then((data) => setMines(data as Mine[]))
      .finally(() => setLoading(false))
  }, [])

  const filteredMines = useMemo(() => {
    let result = [...mines]

    // 1. Search term filter (mine name or state)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      result = result.filter(m => m.name.toLowerCase().includes(q) || m.state.toLowerCase().includes(q))
    }

    // 2. Risk filter
    if (riskFilter !== 'All') {
      result = result.filter(m => m.risk === riskFilter)
    }

    // 3. Sorting
    if (sortBy === 'target') {
      result.sort((a, b) => b.monthlyTarget - a.monthlyTarget)
    } else if (sortBy === 'actual') {
      result.sort((a, b) => b.actual - a.actual)
    } else if (sortBy === 'variance') {
      result.sort((a, b) => (b.actual - b.monthlyTarget) - (a.actual - a.monthlyTarget))
    }

    return result
  }, [mines, searchTerm, riskFilter, sortBy])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mines</h1>
        <p className="page-desc">Active mine sites with current production status</p>
      </div>

      <div className="mines-controls">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search mine name or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="controls-right">
          <div className="filter-group">
            <Filter size={14} className="control-icon" />
            <select
              className="control-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
            >
              <option value="All">All Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          <div className="filter-group">
            <ArrowUpDown size={14} className="control-icon" />
            <select
              className="control-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="default">Default Sort</option>
              <option value="target">Target (High-Low)</option>
              <option value="actual">Actual (High-Low)</option>
              <option value="variance">Variance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mines-count-bar">
        {loading ? (
          <Skeleton width={120} height={16} />
        ) : (
          <span>Showing <strong>{filteredMines.length}</strong> of {mines.length} mines</span>
        )}
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
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
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
            ) : filteredMines.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-results-cell">
                  No mines match your search criteria.
                </td>
              </tr>
            ) : (
              filteredMines.map(m => {
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}