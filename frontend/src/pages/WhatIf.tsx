import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { api } from '../services/api'
import type { WhatIfResult } from '../types'
import './WhatIf.css'

export default function WhatIf() {
  const [rain,     setRain]     = useState(12)
  const [downtime, setDowntime] = useState(4.5)
  const [blast,    setBlast]    = useState(1)
  const [trucks,   setTrucks]   = useState(0)

  const [result, setResult] = useState<WhatIfResult>({
    baseline: 16800,
    predicted: 16800,
    delta: 0,
    risk: 'Low'
  })

  useEffect(() => {
    api.simulate({ rain, downtime, blast, trucks })
      .then(res => setResult(res))
      .catch(err => console.error(err))
  }, [rain, downtime, blast, trucks])

  const { baseline, predicted, delta, risk } = result

  const chartData = [
    { week: 'W1', Baseline: Math.round(baseline * 0.25), Predicted: Math.round(predicted * 0.24) },
    { week: 'W2', Baseline: Math.round(baseline * 0.25), Predicted: Math.round(predicted * 0.25) },
    { week: 'W3', Baseline: Math.round(baseline * 0.25), Predicted: Math.round(predicted * 0.26) },
    { week: 'W4', Baseline: Math.round(baseline * 0.25), Predicted: Math.round(predicted * 0.25) },
  ]


  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">What-If Simulator</h1>
        <p className="page-desc">Adjust parameters and see estimated impact before committing</p>
      </div>

      <div className="whatif-layout">
        <div className="controls">
          <p className="controls-label">Mine: Balaghat (prototype)</p>

          <div className="slider-group">
            <label className="slider-label">
              Rainfall (mm/day) <strong>{rain}</strong>
            </label>
            <input type="range" min={0} max={80} value={rain}
              onChange={e => setRain(+e.target.value)} className="slider" />
          </div>

          <div className="slider-group">
            <label className="slider-label">
              Equipment Downtime (hrs) <strong>{downtime}</strong>
            </label>
            <input type="range" min={0} max={16} step={0.5} value={downtime}
              onChange={e => setDowntime(+e.target.value)} className="slider" />
          </div>

          <div className="slider-group">
            <label className="slider-label">
              Blasting Delay (hrs) <strong>{blast}</strong>
            </label>
            <input type="range" min={0} max={8} step={0.5} value={blast}
              onChange={e => setBlast(+e.target.value)} className="slider" />
          </div>

          <div className="slider-group">
            <label className="slider-label">
              Additional Trucks <strong>{trucks}</strong>
            </label>
            <input type="range" min={0} max={4} value={trucks}
              onChange={e => setTrucks(+e.target.value)} className="slider" />
          </div>
        </div>

        <div className="result">
          <p className="result-label">Predicted 30-Day Production</p>
          <p className="result-value" style={{ color: delta >= 0 ? 'var(--accent)' : 'var(--accent-danger)' }}>
            {predicted.toLocaleString()} t
          </p>
          <p className="result-delta" style={{ color: delta >= 0 ? 'var(--accent)' : 'var(--accent-danger)' }}>
            {delta >= 0 ? '+' : ''}{delta.toLocaleString()} t vs baseline
          </p>
          <div className="result-row">
            <span className="result-key">Risk Level</span>
            <span className={`badge badge--${risk.toLowerCase()}`}>{risk}</span>
          </div>
          <div className="result-row">
            <span className="result-key">Baseline</span>
            <span className="result-val">{baseline.toLocaleString()} t</span>
          </div>
          <p className="disclaimer">Rule-based estimate for planning reference only. Not a certified forecast.</p>
        </div>
      </div>

      <div className="chart-box">
        <p className="chart-title">Weekly Breakdown — Baseline vs Predicted</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={11} />
            <YAxis stroke="var(--text-muted)" fontSize={11} />
            <Tooltip
              contentStyle={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 11 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Baseline"  stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.5} />
            <Area type="monotone" dataKey="Predicted" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}