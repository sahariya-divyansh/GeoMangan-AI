import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { forecastRows } from '../data/synthetic'
import './Production.css'

export default function Production() {
  const chartData = forecastRows.map(f => ({
    mine: f.mine.replace(' Mine', ''),
    Target: f.target,
    Forecast: f.d30,
  }))

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Production</h1>
        <p className="page-desc">Forecast vs target across 7, 30 and 90 day horizons</p>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="mine" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Target"   fill="#30363d" radius={[3,3,0,0]} />
            <Bar dataKey="Forecast" fill="#2ea043" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
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
                <td className={shortfall ? 'negative' : 'positive'}>{f.d30.toLocaleString()}</td>
                <td>{f.d90.toLocaleString()}</td>
                <td><span className={`badge badge--${f.risk.toLowerCase()}`}>{f.risk}</span></td>
                <td className="reason">{f.reason}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}