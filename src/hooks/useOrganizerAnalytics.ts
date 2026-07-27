import useSWR from "swr";

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
  const { organizerId, from, to } = options;

  const params = new URLSearchParams();
  if (organizerId) params.set("organizerId", organizerId);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString() ? `?${params.toString()}` : "";

  const key = organizerId || from || to ? `/api/organizer/analytics${qs}` : null;

  const { data, error, isLoading } = useSWR<OrganizerAnalytics | null>(
    key,
    async () => {
      const res = await fetch(`/api/organizer/analytics${qs}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return (await res.json()) as OrganizerAnalytics;
    },
    { revalidateOnFocus: false, dedupingInterval: 60_000 },
  );

  return {
    data: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
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
