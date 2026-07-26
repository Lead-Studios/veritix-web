import type { Event } from "@/types/event";
import type { Organizer } from "@/types/organizer";
import { mockEvents } from "@/mocks/events";
import { apiClient } from "./apiClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function fetchEvents(): Promise<Event[]> {
  if (!API_BASE) return mockEvents;
  return apiClient.get<Event[]>("/events");
}

export async function fetchEventById(id: string): Promise<Event | null> {
  if (!API_BASE) {
    return mockEvents.find((e) => e.id === id) ?? null;
  }
  try {
    return await apiClient.get<Event>(`/events/${id}`);
  } catch (error) {
    if (error instanceof Error && (error as any).status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchOrganizerById(
  id: string,
): Promise<Organizer | null> {
  if (!API_BASE) {
    const organizerMap: Record<string, Organizer> = {
      "rhythm-nation-collective": {
        id: "rhythm-nation-collective",
        name: "Rhythm Nation Collective",
        avatar: "/images/organizers/rhythm-nation.png",
        description: "Bringing immersive music experiences to life",
        verified: true,
      },
      "beat-collective": {
        id: "beat-collective",
        name: "Beat Collective",
        avatar: "/images/organizers/beat-collective.png",
        description: "Electronic music events since 2015",
        verified: true,
      },
    };
    return organizerMap[id] ?? null;
  }
  try {
    return await apiClient.get<Organizer>(`/organizers/${id}`);
  } catch (error) {
    if (error instanceof Error && (error as any).status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchEventsByOrganizer(
  organizerId: string,
): Promise<Event[]> {
  const events = await fetchEvents();
  return events.filter((e) => e.organizer?.id === organizerId);
}
