import { useState, useEffect } from "react";

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
    /** Remaining tickets available for sale */
    remainingTickets?: number;
    /** Average price per ticket */
    averageTicketPrice?: number;
    /** Total ticket capacity */
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
  const [data, setData] = useState<OrganizerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { organizerId, from, to } = options;

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
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json() as Promise<OrganizerAnalytics>;
      })
      .then((json) => {
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
  }, [organizerId, from, to]);

  return { data, loading, error };
}
