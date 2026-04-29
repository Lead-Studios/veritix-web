import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "veritix_favorites";

function getStoredFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function storeFavorites(favorites: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function syncFavoriteToApi(
  eventId: string,
  liked: boolean
): Promise<void> {
  if (!API_BASE) return;
  await fetch(`${API_BASE}/events/${eventId}/favorite`, {
    method: liked ? "POST" : "DELETE",
  });
}

export function useFavorite(eventId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLiked(getStoredFavorites().has(eventId));
  }, [eventId]);

  const toggle = useCallback(async () => {
    const next = !isLiked;
    // Optimistic update
    setIsLiked(next);
    setError(null);

    const favorites = getStoredFavorites();
    if (next) {
      favorites.add(eventId);
    } else {
      favorites.delete(eventId);
    }
    storeFavorites(favorites);

    setIsPending(true);
    try {
      await syncFavoriteToApi(eventId, next);
    } catch {
      // Rollback on API failure
      setIsLiked(!next);
      const rollback = getStoredFavorites();
      if (!next) {
        rollback.add(eventId);
      } else {
        rollback.delete(eventId);
      }
      storeFavorites(rollback);
      setError("Failed to update favorite. Please try again.");
    } finally {
      setIsPending(false);
    }
  }, [eventId, isLiked]);

  return { isLiked, isPending, error, toggle };
}
