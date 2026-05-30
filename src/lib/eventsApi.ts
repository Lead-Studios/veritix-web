import type { Event } from "@/types/event";
import type { Organizer } from "@/types/organizer";
import { mockEvents } from "@/mocks/events";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function fetchEvents(): Promise<Event[]> {
  if (!API_BASE) return mockEvents;
  const res = await fetch(`${API_BASE}/events`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json() as Promise<Event[]>;
}

export async function fetchEventById(id: string): Promise<Event | null> {
  if (!API_BASE) {
    return mockEvents.find((e) => e.id === id) ?? null;
  }
  const res = await fetch(`${API_BASE}/events/${id}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json() as Promise<Event>;
}

export async function fetchOrganizerById(id: string): Promise<Organizer | null> {
  if (!API_BASE) {
    const organizerNames = [...new Set(mockEvents.map(e => e.organizer?.name).filter(Boolean))];
    const organizerMap: Record<string, Organizer> = {
      "Rhythm Nation Collective": {
        id: "rhythm-nation-collective",
        name: "Rhythm Nation Collective",
        avatar: "/images/organizers/rhythm-nation.png",
        description: "Bringing immersive music experiences to life",
        verified: true,
      },
      "Beat Collective": {
        id: "beat-collective",
        name: "Beat Collective",
        avatar: "/images/organizers/beat-collective.png",
        description: "Electronic music events since 2015",
        verified: true,
      },
    };
    return organizerMap[id] ?? null;
  }
  const res = await fetch(`${API_BASE}/organizers/${id}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch organizer");
  return res.json() as Promise<Organizer>;
}

export async function fetchEventsByOrganizer(organizerId: string): Promise<Event[]> {
  const events = await fetchEvents();
  return events.filter(e => e.organizer?.name && getOrganizerIdFromName(e.organizer.name) === organizerId);
}

function getOrganizerIdFromName(name: string): string {
  const nameToId: Record<string, string> = {
    "Rhythm Nation Collective": "rhythm-nation-collective",
    "Beat Collective": "beat-collective",
  };
  return nameToId[name] ?? name.toLowerCase().replace(/\s+/g, '-');
}
