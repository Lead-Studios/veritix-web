import type { Event } from "@/types/event";
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
