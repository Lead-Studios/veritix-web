"use client";

import { useCallback, useEffect, useState } from "react";

interface CachedTicket {
  ticketCode: string;
  status: "valid" | "invalid";
  cachedAt: number;
}

const CACHE_KEY = "veritix_offline_cache";
const CACHE_TTL_MS = 30 * 60 * 1000;

export function useOfflineVerification() {
  const [isOnline, setIsOnline] = useState(true);
  const [cache, setCache] = useState<Map<string, CachedTicket>>(new Map());

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed: CachedTicket[] = JSON.parse(stored);
        const validEntries = parsed.filter(
          (t) => Date.now() - t.cachedAt < CACHE_TTL_MS
        );
        setCache(new Map(validEntries.map((t) => [t.ticketCode, t])));
      }
    } catch {
      // corrupted cache
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const verifyOffline = useCallback(
    (ticketCode: string): CachedTicket | null => {
      const cached = cache.get(ticketCode);
      if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
        return cached;
      }
      return null;
    },
    [cache]
  );

  const cacheResult = useCallback(
    (ticketCode: string, status: "valid" | "invalid") => {
      const entry: CachedTicket = {
        ticketCode,
        status,
        cachedAt: Date.now(),
      };
      const next = new Map(cache);
      next.set(ticketCode, entry);

      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(Array.from(next.values()))
        );
      } catch {
        // storage full
      }

      setCache(next);
    },
    [cache]
  );

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // ignore
    }
    setCache(new Map());
  }, []);

  return {
    isOnline,
    cacheSize: cache.size,
    verifyOffline,
    cacheResult,
    clearCache,
  };
}
