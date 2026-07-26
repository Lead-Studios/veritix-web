import { useState, useCallback } from "react";

const KEY = "veritix_favourites";

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
    ) {
      return parsed;
    }
    return [];
  } catch (e: unknown) {
    console.error("Failed to load or parse favourites from localStorage", e);
    return [];
  }
}

export function useFavouriteEvents() {
  const [favourites, setFavourites] = useState<string[]>(load);

  const toggle = useCallback((eventId: string) => {
    setFavourites((prev) => {
      const next = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (eventId: string) => favourites.includes(eventId),
    [favourites],
  );

  return { favourites, toggle, isFavourite };
}
