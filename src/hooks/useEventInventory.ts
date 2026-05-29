"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchEventInventory,
  type TicketTypeInventory,
} from "@/lib/inventoryApi";

interface UseEventInventoryOptions {
  /** Polling interval in milliseconds. Set to 0 to disable polling. */
  intervalMs?: number;
}

interface UseEventInventoryResult {
  data: TicketTypeInventory[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Polls the backend at a configurable interval so ticket-type rows show
 * near real-time sold / total counts. Polling stops when the tab is hidden
 * and resumes on focus to avoid unnecessary work.
 */
export function useEventInventory(
  eventId: string | undefined,
  { intervalMs = 30_000 }: UseEventInventoryOptions = {},
): UseEventInventoryResult {
  const [data, setData] = useState<TicketTypeInventory[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(eventId));
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (!eventId) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      setError(null);
      const result = await fetchEventInventory(eventId, {
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setData(result);
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    load();
    return () => abortRef.current?.abort();
  }, [eventId, load]);

  useEffect(() => {
    if (!eventId || intervalMs <= 0) return;
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      load();
    }, intervalMs);
    const onFocus = () => load();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
    }
    return () => {
      clearInterval(id);
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", onFocus);
      }
    };
  }, [eventId, intervalMs, load]);

  return { data, loading, error, refresh: load };
}
