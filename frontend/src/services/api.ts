import type { ForecastRow, Recommendation, WhatIfInput, WhatIfResult, DiagnosisResult } from '../types'

const BASE = 'http://localhost:8000'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMine(m: any) {
  return {
    ...m,
    monthlyTarget: m.monthly_target,
    ironIndex: m.iron_index,
  }
}

export const api = {
  getMines:           () => get<any[]>('/api/mines').then(data => data.map(mapMine)),
  getMine:            (id: string) => get<any>(`/api/mines/${id}`).then(mapMine),
  getZones:           () => get<any[]>('/api/exploration').then(data => data.map((z: any) => ({ ...z, mineId: z.mine_id, ironIndex: z.iron_index }))),
  getForecasts:       () => get<ForecastRow[]>('/api/production'),
  getRecommendations: () => get<Recommendation[]>('/api/recommendations'),
  simulate:           (body: WhatIfInput) => post<WhatIfResult>('/api/whatif', body),
  explainZone:        (body: unknown) => post<{ feature: string; impact: number }[]>('/api/predict/explain', body),
  diagnose:           (body: unknown) => post<DiagnosisResult>('/api/production/diagnose', body),
}
