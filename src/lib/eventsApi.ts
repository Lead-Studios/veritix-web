import type { Event } from "@/types/event";
import type { Organizer } from "@/types/organizer";
import { apiClient } from "./apiClient";
import { authedFetch } from "./authedFetch";
import { API_ROUTES } from "./api-routes";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function fetchEvents(params?: { page?: number; limit?: number }): Promise<Event[]> {
import { ApiError, apiClient } from "./apiClient";
import { API_ROUTES } from "./api-routes";

export async function fetchEvents(params?: {
  page?: number;
  limit?: number;
}): Promise<Event[]> {
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

export async function fetchOrganizerById(id: string): Promise<Organizer | null> {
  try {
    const res = await authedFetch(`${API_BASE}/organizers/${id}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch organizer: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchEventsByOrganizer(organizerId: string): Promise<Event[]> {
  return apiClient.get<Event[]>(`${API_ROUTES.events.list}?organizerId=${organizerId}`);
}
