import { useState, useEffect } from 'react'

let globalLastUpdated: Date | null = new Date()
const listeners = new Set<(date: Date | null) => void>()

export function setLastUpdated(date: Date) {
  globalLastUpdated = date
  listeners.forEach(cb => cb(date))
}

function calculateTimeAgo(date: Date | null): string {
  if (!date) return 'never'
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 30) return 'just now'
  const mins = Math.floor(seconds / 60)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  if (mins < 60) return `${mins} mins ago`
  const hours = Math.floor(mins / 60)
  if (hours === 1) return '1 hour ago'
  return `${hours} hours ago`
}

export function useLastUpdated() {
  const [lastUpdated, setLastUpdatedState] = useState<Date | null>(globalLastUpdated)
  const [timeAgo, setTimeAgo] = useState<string>(() => calculateTimeAgo(globalLastUpdated))

  useEffect(() => {
    const handleUpdate = (date: Date | null) => {
      setLastUpdatedState(date)
      setTimeAgo(calculateTimeAgo(date))
    }
    listeners.add(handleUpdate)

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(globalLastUpdated))
    }, 60000)

    return () => {
      listeners.delete(handleUpdate)
      clearInterval(interval)
    }
  }, [])

  const manualSetLastUpdated = (date: Date) => {
    setLastUpdated(date)
  }

  return { lastUpdated, setLastUpdated: manualSetLastUpdated, timeAgo }
}
