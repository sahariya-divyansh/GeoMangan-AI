import type { Mine } from '../types'

export interface AlertMine {
  id: string
  name: string
  monthlyTarget: number
  actual: number
  shortfall: number
  risk: 'High' | 'Medium' | 'Low'
}

let alertMines: AlertMine[] = []
const alertListeners = new Set<(alerts: AlertMine[]) => void>()

export function setAlertMines(mines: Mine[]) {
  const alerts: AlertMine[] = mines
    .filter(m => m.actual < m.monthlyTarget * 0.95)
    .map(m => ({
      id: m.id,
      name: m.name,
      monthlyTarget: m.monthlyTarget,
      actual: m.actual,
      shortfall: m.monthlyTarget - m.actual,
      risk: m.risk,
    }))
  alertMines = alerts
  alertListeners.forEach(cb => cb(alerts))
}

export function getAlertMines(): AlertMine[] {
  return alertMines
}

export function subscribeAlerts(cb: (alerts: AlertMine[]) => void) {
  alertListeners.add(cb)
  return () => {
    alertListeners.delete(cb)
  }
}
