import useSWR, { mutate } from "swr";
import { fetchEvents, fetchEventById } from "@/lib/eventsApi";
import type { Event } from "@/types/event";

const EVENTS_KEY = "events";

export function useEvents() {
  const { data, error, isLoading } = useSWR<Event[]>(EVENTS_KEY, fetchEvents, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  return {
    events: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
  };
}

export function useEvent(id: string) {
  const { data, error, isLoading } = useSWR<Event | null>(
    id ? `event-${id}` : null,
    () => fetchEventById(id),
    { revalidateOnFocus: false, dedupingInterval: 60_000 }
  );

  return { event: data ?? null, loading: isLoading, error: error?.message ?? null };
}

/** Call after creating or updating an event to invalidate the cache. */
export function invalidateEvents() {
  return mutate(EVENTS_KEY);
}
