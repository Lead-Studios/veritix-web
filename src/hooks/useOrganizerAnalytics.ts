import { useState, useEffect } from "react";

export interface DemographicItem {
  label: string;
  count: number;
  percentage: number;
}

export interface Demographics {
  region: DemographicItem[];
  deviceType: DemographicItem[];
  referralSource: DemographicItem[];
export interface TicketTypeBreakdown {
  type: string;
  count: number;
  revenue: number;
}

export interface Demographics {
  region: { label: string; count: number; percentage: number }[];
  deviceType: { label: string; count: number; percentage: number }[];
  referralSource: { label: string; count: number; percentage: number }[];
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
  events?: { name: string; coverImage?: string }[];
  ticketBreakdown?: { type: string; count: number; revenue: number }[];
  demographics?: Demographics;
}

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token") ?? "";
}

export function useOrganizerAnalytics(params?: { from?: string; to?: string }) {
  const [data, setData] = useState<OrganizerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = getToken();
    const query = new URLSearchParams();
    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);
    const qs = query.toString() ? `?${query.toString()}` : "";
    fetch(`/api/organizer/analytics${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params?.from, params?.to]);

  return { data, loading, error };
}
