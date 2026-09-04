import { prospectivityZones } from '../data/synthetic'
import './Exploration.css'

export default function Exploration() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Exploration</h1>
        <p className="page-desc">Prospectivity scores from satellite spectral indicators</p>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Zone ID</th>
            <th>Mine ID</th>
            <th>Score</th>
            <th>Confidence</th>
            <th>NDVI</th>
            <th>Iron Index</th>
            <th>Recommended Action</th>
          </tr>
        </thead>
        <tbody>
          {prospectivityZones.map(z => (
            <tr key={z.id}>
              <td className="muted">{z.id}</td>
              <td>{z.mineId}</td>
              <td>
                <div className="score-cell">
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${z.score}%`,
                        background:
                          z.score > 80 ? 'var(--accent)' :
                          z.score > 60 ? 'var(--accent-warn)' :
                          'var(--accent-danger)'
                      }}
                    />
                  </div>
                  <span>{z.score}</span>
                </div>
              </td>
              <td>
                <span className={`badge badge--${z.confidence.toLowerCase()}`}>
                  {z.confidence}
                </span>
              </td>
              <td>{z.ndvi}</td>
              <td>{z.ironIndex}</td>
              <td className="action-cell">{z.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="disclaimer">
        Prospectivity scores are exploration-prioritization estimates derived from
        satellite indicators. They do not constitute certified reserve figures and
        require field validation before operational use.
      </p>
    </div>
  )
}