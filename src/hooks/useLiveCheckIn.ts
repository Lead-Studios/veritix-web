'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { buildUrl, API_ROUTES } from '@/lib/api-routes';

export interface CheckInStats {
  eventId: string;
  checkedIn: number;
  total: number;
  capacity: number;
  lastUpdatedAt: string;
}

interface UseLiveCheckInOptions {
  /** Polling interval in ms (default: 15 000) */
  interval?: number;
  /** Stop polling when tab is hidden */
  pauseOnHidden?: boolean;
}

/**
 * Polls the check-in stats endpoint at a configurable interval and returns
 * live counts for the given event. Pauses when the page is hidden to
 * avoid unnecessary background requests.
 *
 * @example
 * const { stats, isLoading, error, refresh } = useLiveCheckIn(eventId);
 */
export function useLiveCheckIn(eventId: string, options: UseLiveCheckInOptions = {}) {
  const { interval = 15_000, pauseOnHidden = true } = options;

  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStats = useCallback(async () => {
    if (pauseOnHidden && document.hidden) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(buildUrl(API_ROUTES.events.checkIn(eventId)), {
        signal: ac.signal,
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CheckInStats = await res.json();
      setStats(data);
      setError(null);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventId, pauseOnHidden]);

  const scheduleNext = useCallback(() => {
    timerRef.current = setTimeout(() => {
      fetchStats().then(scheduleNext);
    }, interval);
  }, [fetchStats, interval]);

  useEffect(() => {
    setIsLoading(true);
    fetchStats().then(scheduleNext);

    const handleVisibility = () => {
      if (!document.hidden) {
        // Resumed from hidden — fetch immediately
        fetchStats();
      }
    };

    if (pauseOnHidden) {
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      abortRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchStats, scheduleNext, pauseOnHidden]);

  return { stats, isLoading, error, refresh: fetchStats };
}
