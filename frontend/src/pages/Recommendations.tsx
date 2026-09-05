import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { api } from '../services/api'
import type { Recommendation } from '../types'
import './Recommendations.css'

export default function Recommendations() {
  const [recs, setRecs] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getRecommendations()
      .then(data => setRecs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const exportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('GeoMangan-AI Recommendations Report', 14, 20)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const dateStr = `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
    doc.text(dateStr, 14, 28)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    let y = 38
    doc.text('Mine', 14, y)
    doc.text('Severity', 48, y)
    doc.text('Title', 75, y)
    doc.text('Status', 145, y)
    doc.text('Recovery', 170, y)

    doc.setLineWidth(0.5)
    doc.line(14, y + 2, 196, y + 2)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    y += 8

    recs.forEach(r => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(r.mine.replace(' Mine', ''), 14, y)
      doc.text(r.severity, 48, y)

      const truncatedTitle = r.title.length > 32 ? r.title.substring(0, 29) + '...' : r.title
      doc.text(truncatedTitle, 75, y)
      doc.text(r.status, 145, y)

      const truncatedRecovery = r.recovery.length > 22 ? r.recovery.substring(0, 19) + '...' : r.recovery
      doc.text(truncatedRecovery, 170, y)
      y += 8
    })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(128, 128, 128)
    doc.text('Prototype - synthetic data only', 14, 285)

    doc.save('recommendations-report.pdf')
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    )
  }

  const pending  = recs.filter(r => r.status === 'Pending').length
  const approved = recs.filter(r => r.status === 'Approved').length
  const rejected = recs.filter(r => r.status === 'Rejected').length

  function decide(id: string, decision: 'Approved' | 'Rejected') {
    setRecs(prev => prev.map(r => r.id === id ? { ...r, status: decision } : r))
  }

  return (
    <div className="page">
      <div className="page-header page-header--flex">
        <div>
          <h1 className="page-title">Recommendations</h1>
          <p className="page-desc">AI-generated corrective actions requiring officer approval</p>
        </div>
        <button className="btn btn--export" onClick={exportPDF}>
          <Download size={14} />
          Export PDF
        </button>
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