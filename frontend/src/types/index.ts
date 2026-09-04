export interface Mine {
  id: string
  name: string
  state: string
  lat: number
  lng: number
  monthlyTarget: number
  actual: number
  risk: 'High' | 'Medium' | 'Low'
}

export interface ProspectivityZone {
  id: string
  mineId: string
  lat: number
  lng: number
  score: number
  confidence: 'High' | 'Medium' | 'Low'
  ndvi: number
  ironIndex: number
  action: string
}

export interface ForecastRow {
  mine: string
  target: number
  d7: number
  d30: number
  d90: number
  risk: string
  reason: string
}

export interface Recommendation {
  id: string
  mine: string
  severity: string
  title: string
  reason: string
  recovery: string
  status: 'Pending' | 'Approved' | 'Rejected'
}
