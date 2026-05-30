import useSWR from "swr";
import type { Organizer } from "@/types/organizer";
import { fetchOrganizerById, fetchEventsByOrganizer } from "@/lib/eventsApi";
import type { Event } from "@/types/event";

export function useOrganizer(id: string | undefined) {
  const { data, error, isLoading } = useSWR<Organizer | null>(
    id ? `organizer-${id}` : null,
    () => id ? fetchOrganizerById(id) : null,
    { revalidateOnFocus: false, dedupingInterval: 60_000 }
  );

  return { organizer: data ?? null, loading: isLoading, error: error?.message ?? null };
}

export function useOrganizerEvents(organizerId: string | undefined) {
  const { data, error, isLoading } = useSWR<Event[]>(
    organizerId ? `organizer-events-${organizerId}` : null,
    () => organizerId ? fetchEventsByOrganizer(organizerId) : [],
    { revalidateOnFocus: false, dedupingInterval: 60_000 }
  );

  return { events: data ?? [], loading: isLoading, error: error?.message ?? null };
}