import { useState } from "react";

interface DuplicateEventResponse {
  id: string;
}

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
      const { id }: DuplicateEventResponse = await res.json();
      return id;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { duplicate, loading, error };
}
