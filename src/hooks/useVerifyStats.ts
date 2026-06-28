import { useState, useEffect } from "react";

interface VerifyStats { scanned: number; valid: number; invalid: number; }

export function useVerifyStats(eventId?: string) {
  const [stats, setStats] = useState<VerifyStats>({ scanned: 0, valid: 0, invalid: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    const token = localStorage.getItem("auth_token") ?? "";
    fetch(`/api/verify/stats?eventId=${eventId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setStats(d); })
      .finally(() => setLoading(false));
  }, [eventId]);

  return { stats, loading };
}
