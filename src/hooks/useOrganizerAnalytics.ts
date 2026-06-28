import { useState, useEffect } from "react";

interface AnalyticsData { revenue: number; ticketsSold: number; events: number; }

function getToken() {
  return localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token") ?? "";
}

export function useOrganizerAnalytics(organizerId: string) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizerId) return;
    setLoading(true);
    const token = getToken();
    fetch(`/api/organizer/analytics?id=${organizerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Analytics request failed: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [organizerId]);

  return { data, loading, error };
}
