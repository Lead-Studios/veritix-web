import { useState } from "react";

export function useDuplicateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duplicate = async (eventId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token") ?? "";
      const res = await fetch(`/api/events/${eventId}/duplicate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to duplicate event: ${res.status}`);
      const { id } = await res.json();
      return id as string;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { duplicate, loading, error };
}
