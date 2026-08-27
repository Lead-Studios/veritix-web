import type { Event } from "@/types/event";
import type { Organizer } from "@/types/organizer";
import { ApiError, apiClient } from "./apiClient";
import { API_ROUTES } from "./api-routes";

export async function fetchEvents(params?: { page?: number; limit?: number }): Promise<Event[]> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  return apiClient.get<Event[]>(`${API_ROUTES.events.list}?page=${page}&limit=${limit}`);
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    return await apiClient.get<Event>(API_ROUTES.events.detail(id));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchOrganizerById(
  id: string,
): Promise<Organizer | null> {
  try {
    return await apiClient.get<Organizer>(`/organizers/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
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
