import { useState } from 'react'
import { recommendations as initialRecs } from '../data/synthetic'
import type { Recommendation } from '../types'
import './Recommendations.css'

export default function Recommendations() {
  const [recs, setRecs] = useState<Recommendation[]>(initialRecs)

  const pending  = recs.filter(r => r.status === 'Pending').length
  const approved = recs.filter(r => r.status === 'Approved').length
  const rejected = recs.filter(r => r.status === 'Rejected').length

  function decide(id: string, decision: 'Approved' | 'Rejected') {
    setRecs(prev => prev.map(r => r.id === id ? { ...r, status: decision } : r))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Recommendations</h1>
        <p className="page-desc">AI-generated corrective actions requiring officer approval</p>
      </div>

      <div className="summary-bar">
        <span className="summary-item pending">{pending} Pending</span>
        <span className="summary-item approved">{approved} Approved</span>
        <span className="summary-item rejected">{rejected} Rejected</span>
      </div>

      <div className="rec-list">
        {recs.map(r => (
          <div key={r.id} className={`rec-card rec-card--${r.severity.toLowerCase()}`}>
            <div className="rec-top">
              <span className={`badge badge--${r.severity.toLowerCase()}`}>{r.severity}</span>
              <span className="rec-mine">{r.mine}</span>
              <span className={`rec-status status--${r.status.toLowerCase()}`}>{r.status}</span>
            </div>
            <p className="rec-title">{r.title}</p>
            <p className="rec-reason">{r.reason}</p>
            <p className="rec-recovery">{r.recovery}</p>
            {r.status === 'Pending' && (
              <div className="rec-actions">
                <button className="btn btn--approve" onClick={() => decide(r.id, 'Approved')}>
                  Approve
                </button>
                <button className="btn btn--reject" onClick={() => decide(r.id, 'Rejected')}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}