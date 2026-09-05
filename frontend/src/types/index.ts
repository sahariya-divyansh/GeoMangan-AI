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

export interface WhatIfInput {
  rain: number
  downtime: number
  blast: number
  trucks: number
}

export interface WhatIfResult {
  baseline: number
  predicted: number
  delta: number
  risk: string
}

export interface DiagnosisResult {
  primary_reason: string
  primary_contribution: number
  secondary_reason: string | null
  secondary_contribution: number | null
  shortfall_probability: number
  shortfall_tonnes: number
  suggested_action: string
}

export interface LSTMInput {
  equipment_availability: number
  rainfall: number
  blast_delay: number
  ore_grade: number
  working_days: number
  prev_month_production: number
  month: number
}

export interface LSTMResult {
  predicted: number
  model_type: string
  confidence_interval: [number, number]
  risk: string
}

export interface WeatherResult {
  avg_rainfall_mm: number
  avg_temperature_c: number
  avg_humidity_pct: number
  days_fetched: number
  source: string
}




