import { useState, useEffect, useRef } from 'react'

export interface VerifyStats {
  capacity: number
  totalScanned: number
  remaining: number
}

interface UseVerifyStatsResult {
  stats: VerifyStats | null
  loading: boolean
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export function useVerifyStats(eventId: string | null): UseVerifyStatsResult {
  const [stats, setStats] = useState<VerifyStats | null>(null)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!eventId) {
      setStats(null)
      setLoading(false)
      return
    }

    const url = API_BASE
      ? `${API_BASE}/events/${eventId}/capacity`
      : `/api/events/${eventId}/capacity`

    const fetchStats = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) return
        const data: VerifyStats = await res.json()
        setStats(data)
      } catch {
        // silent — keep stale data on network error
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchStats()

    intervalRef.current = setInterval(fetchStats, 10_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [eventId])

  return { stats, loading }
}
