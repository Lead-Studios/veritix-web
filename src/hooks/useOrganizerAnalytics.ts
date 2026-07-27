import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Demographics {
  region: { label: string; count: number; percentage: number }[];
  deviceType: { label: string; count: number; percentage: number }[];
  referralSource: { label: string; count: number; percentage: number }[];
}

export interface OrganizerAnalytics {
  // Summary KPIs
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalEarned: number;
  payoutsQueued: number;
  nextSettlementDays: number;

  // Live check-ins
  checkInsLive: boolean;
  doorsOpenInMinutes?: number;

  // Chart series
  revenue: { day: string; revenue: number }[];
  performance: { day: string; value: number }[];

  // Ticket type breakdown
  ticketBreakdown: { type: string; count: number; revenue: number }[];

  // Audience demographics
  demographics: Demographics;

  // Event list (for images, live card, etc.)
  events: {
    id: string;
    name: string;
    coverImage?: string;
    remainingTickets?: number;
    averageTicketPrice?: number;
    totalTickets?: number;
  }[];

  // Legacy fields kept for backward compatibility
  recentActivity?: { date: string; action: string }[];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface Options {
  organizerId?: string;
  from?: string;
  to?: string;
}

export function useOrganizerAnalytics(options: Options = {}) {
  const router = useRouter();
  const [data, setData] = useState<OrganizerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const { organizerId, from, to } = options;

  /** Call this to re-fetch analytics data (e.g. from an error-state Retry button). */
  const mutate = useCallback(() => setFetchKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (organizerId) params.set("organizerId", organizerId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString() ? `?${params.toString()}` : "";

    fetch(`/api/organizer/analytics${qs}`)
      .then(async (res) => {
        // 401 → clear stored tokens and redirect to login
        if (res.status === 401) {
          try {
            localStorage.removeItem("session");
            sessionStorage.clear();
          } catch {
            // storage may not be available
          }
          router.replace("/login?next=/dashboard");
          if (!cancelled) {
            setError("Your session has expired. Redirecting to login…");
            setLoading(false);
          }
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch analytics (${res.status})`);
        }

        const json = (await res.json()) as OrganizerAnalytics;
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [organizerId, from, to, fetchKey, router]);

  return { data, loading, error, mutate };
}

// ─── Selectors ────────────────────────────────────────────────────────────────

export function selectRevenue(data: OrganizerAnalytics | null) {
  return data?.revenue ?? [];
}

export function selectTicketBreakdown(data: OrganizerAnalytics | null) {
  return data?.ticketBreakdown ?? [];
}

export function selectLiveCheckIns(data: OrganizerAnalytics | null) {
  return {
    checkInsLive: data?.checkInsLive ?? false,
    doorsOpenInMinutes: data?.doorsOpenInMinutes,
  };
}
