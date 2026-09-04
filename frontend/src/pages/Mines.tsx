import { mines } from '../data/synthetic'
import type { Mine } from '../types'
import './Mines.css'

const formatTonnes = (value: number) => value.toLocaleString('en-IN')

const getVarianceClass = (variance: number) =>
  variance >= 0 ? 'mines-table__variance--positive' : 'mines-table__variance--negative'

const getRiskClass = (risk: Mine['risk']) => {
  const riskClassMap: Record<Mine['risk'], string> = {
    High: 'mines-table__risk--high',
    Medium: 'mines-table__risk--medium',
    Low: 'mines-table__risk--low',
  }

  return riskClassMap[risk]
}

export default function Mines() {
  return (
    <section className="mines-page">
      <div className="mines-page__header">
        <h2>Mines</h2>
        <p>Production performance across active manganese operations</p>
      </div>

      <div className="mines-table-wrap">
        <table className="mines-table">
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
            {mines.map((mine: Mine) => {
              const variance = mine.actual - mine.monthlyTarget
              const varianceSign = variance >= 0 ? '+' : '-'

              return (
                <tr key={mine.id}>
                  <td>{mine.id}</td>
                  <td>{mine.name}</td>
                  <td>{mine.state}</td>
                  <td>{formatTonnes(mine.monthlyTarget)}</td>
                  <td>{formatTonnes(mine.actual)}</td>
                  <td className={getVarianceClass(variance)}>
                    {varianceSign}
                    {formatTonnes(Math.abs(variance))}
                  </td>
                  <td>
                    <span className={`mines-table__risk ${getRiskClass(mine.risk)}`}>
                      {mine.risk}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
