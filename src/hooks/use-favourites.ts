'use client';

import * as React from 'react';
import { api } from '@/lib/api-client';

/**
 * Saved events.
 *
 * A signed-in buyer's favourites live on the server, so they follow them
 * between devices. Without a session — or if the favourites service is having a
 * bad day — the same list is kept in `localStorage` so the control still works.
 * Every storage access is wrapped: private modes and full quotas throw, and a
 * favourite is never worth breaking a page over.
 */

export type FavouritesSource = 'server' | 'local';

export interface UseFavouritesResult {
  /** Favoured event ids. */
  favourites: string[];
  isFavourite: (eventId: string) => boolean;
  toggle: (eventId: string) => void;
  isLoading: boolean;
  /** Where the current list is being persisted. */
  source: FavouritesSource;
}

const STORAGE_KEY = 'veritix.favourites';
const ENDPOINT = '/me/favourites';

function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}

function writeStored(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Quota exhausted or storage blocked — the in-memory list still works.
  }
}

export function useFavourites(): UseFavouritesResult {
  const [favourites, setFavourites] = React.useState<string[]>([]);
  const [source, setSource] = React.useState<FavouritesSource>('local');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Prefer the server list when there is a session behind it.
        const saved = await api.get<string[]>(ENDPOINT);
        if (cancelled) return;

        if (Array.isArray(saved)) {
          setFavourites(saved);
          setSource('server');
        } else {
          throw new Error('Unexpected favourites response');
        }
      } catch {
        if (cancelled) return;

        // Signed out, or the service is unavailable — keep them on the device.
        setFavourites(readStored());
        setSource('local');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = React.useCallback(
    (eventId: string) => {
      const alreadySaved = favourites.includes(eventId);
      const next = alreadySaved
        ? favourites.filter((id) => id !== eventId)
        : [...favourites, eventId];

      setFavourites(next);

      if (source !== 'server') {
        writeStored(next);
        return;
      }

      const request = alreadySaved
        ? api.delete<void>(`${ENDPOINT}/${encodeURIComponent(eventId)}`)
        : api.post<void>(ENDPOINT, { eventId });

      // If the server write fails, stop pretending and fall back to the device.
      void request.catch(() => {
        setSource('local');
        writeStored(next);
      });
    },
    [favourites, source],
  );

  const isFavourite = React.useCallback(
    (eventId: string) => favourites.includes(eventId),
    [favourites],
  );

  return { favourites, isFavourite, toggle, isLoading, source };
}
