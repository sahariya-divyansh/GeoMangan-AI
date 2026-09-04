import { forecastRows } from '../data/synthetic'
import './Production.css'

export default function Production() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Production</h1>
        <p className="page-desc">Forecast vs target across 7, 30 and 90 day horizons</p>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Mine</th>
            <th>Monthly Target</th>
            <th>7-Day</th>
            <th>30-Day</th>
            <th>90-Day</th>
            <th>Risk</th>
            <th>Primary Cause</th>
          </tr>
        </thead>
        <tbody>
          {forecastRows.map(f => {
            const shortfall = f.d30 < f.target
            return (
              <tr key={f.mine}>
                <td className="bold">{f.mine}</td>
                <td>{f.target.toLocaleString()}</td>
                <td>{f.d7.toLocaleString()}</td>
                <td className={shortfall ? 'negative' : 'positive'}>
                  {f.d30.toLocaleString()}
                </td>
                <td>{f.d90.toLocaleString()}</td>
                <td>
                  <span className={`badge badge--${f.risk.toLowerCase()}`}>
                    {f.risk}
                  </span>
                </td>
                <td className="reason">{f.reason}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}