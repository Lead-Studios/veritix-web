import type { Event } from "@/types/event";
import type { Organizer } from "@/types/organizer";
import { mockEvents } from "@/mocks/events";
import { apiClient, ApiError } from "./apiClient";
import { authedFetch } from "./authedFetch";
import { API_ROUTES } from "./api-routes";

const mockOrganizers: Record<string, Organizer> = {
  "org-1": { id: "org-1", name: "Rhythm Nation Collective" },
  "org-2": { id: "org-2", name: "Beat Collective" },
};

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
}

export async function fetchEvents(params?: { page?: number; limit?: number }): Promise<Event[]> {
  if (!getApiBase()) return mockEvents as unknown as Event[];

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  return apiClient.get<Event[]>(`${API_ROUTES.events.list}?page=${page}&limit=${limit}`);
}

export async function fetchEventById(id: string): Promise<Event | null> {
  if (!getApiBase()) {
    return (mockEvents.find((event) => event.id === id) as Event | undefined) ?? null;
  }

  try {
    return await apiClient.get<Event>(API_ROUTES.events.detail(id));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function fetchOrganizerById(id: string): Promise<Organizer | null> {
  if (!getApiBase()) return mockOrganizers[id] ?? null;

  const response = await authedFetch(`${getApiBase()}/organizers/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to fetch organizer: ${response.status}`);
  return response.json();
}

export async function fetchEventsByOrganizer(organizerId: string): Promise<Event[]> {
  if (!getApiBase()) {
    return (mockEvents as unknown as Event[]).filter(
      (event) => event.organizer?.id === organizerId,
    );
  }

  return apiClient.get<Event[]>(`${API_ROUTES.events.list}?organizerId=${organizerId}`);
}
