import { useState, useEffect } from "react";

export interface TicketTypeBreakdown {
  type: string;
  count: number;
  revenue: number;
}

export interface DemographicItem {
  label: string;
  count: number;
  percentage: number;
}

export interface Demographics {
  region: DemographicItem[];
  deviceType: DemographicItem[];
  referralSource: DemographicItem[];
}

export interface OrganizerAnalytics {
  revenue: { day: string; revenue: number }[];
  performance: { day: string; value: number }[];
  totalEarned: number;
  payoutsQueued: number;
  nextSettlementDays: number;
  checkInsLive: boolean;
  doorsOpenInMinutes: number;
  totalEvents: number;
  events?: { id: string; name: string; coverImage?: string | null }[];
  ticketBreakdown?: TicketTypeBreakdown[];
  demographics?: Demographics;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function fetchOrganizerAnalytics(): Promise<OrganizerAnalytics> {
  const url = API_BASE
    ? `${API_BASE}/organizer/analytics`
    : "/api/organizer/analytics";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export function useOrganizerAnalytics() {
  const [data, setData] = useState<OrganizerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizerAnalytics()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
