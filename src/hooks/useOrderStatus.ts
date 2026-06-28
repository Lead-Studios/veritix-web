"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type OrderStatus = "PENDING" | "PAID" | "EXPIRED" | "FAILED" | "CANCELLED";

export type OrderStatusResponse = {
  id?: string;
  status?: OrderStatus | string;
  destinationAddress?: string;
  memo?: string;
  amountXLM?: string | number;
  expiresAt?: string;
  [key: string]: unknown;
};

type UseOrderStatusOptions = {
  enabled?: boolean;
  intervalMs?: number;
};

type UseOrderStatusResult = {
  data: OrderStatusResponse | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<OrderStatusResponse | null>;
};

export function useOrderStatus(
  orderId: string | null | undefined,
  { enabled = true, intervalMs = 5000 }: UseOrderStatusOptions = {}
): UseOrderStatusResult {
  const [data, setData] = useState<OrderStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    if (!orderId) return null;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Order status request failed with ${response.status}`);
      }

      const nextData = (await response.json()) as OrderStatusResponse;
      setData(nextData);
      return nextData;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return null;
      }

      const message = err instanceof Error ? err.message : "Could not refresh order status.";
      setError(message);
      return null;
    } finally {
      if (abortRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (!enabled || !orderId) return;

    // Kick off an immediate poll before the interval so confirmation can redirect quickly.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch();
    const timer = window.setInterval(() => {
      void refetch();
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      abortRef.current?.abort();
    };
  }, [enabled, intervalMs, orderId, refetch]);

  return { data, error, isLoading, refetch };
}
