import { useCallback, useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 15_000;

export interface CheckInCounterState {
  checkInCount: number | null;
  totalCapacity: number | null;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

async function fetchCheckInCount(
  eventId: string
): Promise<{ checkInCount: number; totalCapacity: number }> {
  const res = await fetch(`/api/events/${eventId}/check-ins/count`);
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export function useCheckInCounter(
  eventId: string,
  isLive: boolean
): CheckInCounterState {
  const [checkInCount, setCheckInCount] = useState<number | null>(null);
  const [totalCapacity, setTotalCapacity] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref so the interval callback always has the latest `isLive` value
  const isLiveRef = useRef(isLive);
  isLiveRef.current = isLive;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!isLiveRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCheckInCount(eventId);
      setCheckInCount(data.checkInCount);
      setTotalCapacity(data.totalCapacity);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch count");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    fetchData(); // immediate first fetch
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL_MS);
  }, [fetchData, stopPolling]);

  useEffect(() => {
    if (isLive) {
      startPolling();
    } else {
      stopPolling();
    }
    return stopPolling; // cleanup on unmount or dependency change
  }, [isLive, startPolling, stopPolling]);

  return {
    checkInCount,
    totalCapacity,
    lastUpdated,
    loading,
    error,
    refresh: fetchData,
  };
}