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
import type { Mine } from '../types'
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
              stroke="#30363d"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Actual"
              stroke="#2ea043"
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
