import { useState, useEffect } from "react";

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
  events?: { id: string; name: string; coverImage?: string }[];
  ticketBreakdown?: TicketTypeBreakdown[];
  demographics?: Demographics;
}

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token") ?? "";
}

export function useOrganizerAnalytics() {
  const [data, setData] = useState<OrganizerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    fetch("/api/organizer/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Analytics request failed: ${res.status}`);
        return res.json() as Promise<OrganizerAnalytics>;
      })
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
