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
  ticketBreakdown?: TicketTypeBreakdown[];
  demographics?: Demographics;
}

async function fetchOrganizerAnalytics(): Promise<OrganizerAnalytics> {
  const res = await fetch("/api/organizer/analytics");
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
