import { useCallback, useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 10_000;

export interface VerifyStats {
  capacity: number;
  totalScanned: number;
  remaining: number;
}

export interface VerifyStatsState {
  stats: VerifyStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

async function fetchVerifyStats(eventId: string): Promise<VerifyStats> {
  const res = await fetch(`/api/events/${eventId}/capacity`);
  if (!res.ok) {
    throw new Error(`Failed to fetch live stats (${res.status})`);
  }
  return res.json();
}

export function useVerifyStats(eventId: string | null): VerifyStatsState {
  const [stats, setStats] = useState<VerifyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventIdRef = useRef(eventId);
  eventIdRef.current = eventId;

  const fetchData = useCallback(async () => {
    if (!eventIdRef.current) return;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchVerifyStats(eventIdRef.current);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load live stats");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!eventId) {
      setStats(null);
      setLoading(false);
      setError(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    fetchData();
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [eventId, fetchData]);

  return {
    stats,
    loading,
    error,
    refresh: fetchData,
  };
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
