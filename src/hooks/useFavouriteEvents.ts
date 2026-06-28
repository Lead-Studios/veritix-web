import { useState, useCallback } from "react";

const KEY = "veritix_favourites";

function load(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function useFavouriteEvents() {
  const [favourites, setFavourites] = useState<string[]>(load);

  const toggle = useCallback((eventId: string) => {
    setFavourites((prev) => {
      const next = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavourite = useCallback((eventId: string) => favourites.includes(eventId), [favourites]);

  return { favourites, toggle, isFavourite };
}
