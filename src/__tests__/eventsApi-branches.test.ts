import { describe, expect, it, vi } from "vitest";
import { mockEvents } from "../mocks/events";
import { ApiError, apiClient } from "../lib/apiClient";
import {
  fetchEventById,
  fetchEvents,
  fetchEventsByOrganizer,
  fetchOrganizerById,
} from "../lib/eventsApi";

vi.mock("../lib/apiClient", async () => {
  const actual = await vi.importActual<typeof import("../lib/apiClient")>("../lib/apiClient");
  return { ...actual, apiClient: { get: vi.fn() } };
});

const getMock = vi.mocked(apiClient.get);

describe("eventsApi mock branches", () => {
  it("fetchEvents returns mockEvents", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    await expect(fetchEvents()).resolves.toBe(mockEvents);
  });

  it("fetchEventById finds a mock event by id", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    await expect(fetchEventById(mockEvents[0].id)).resolves.toBe(mockEvents[0]);
  });

  it("fetchOrganizerById finds the organizer by its id key", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    await expect(fetchOrganizerById("org-1")).resolves.toMatchObject({ id: "org-1" });
  });
});

describe("eventsApi real API branches", () => {
  it("fetchEvents returns the parsed API response", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    const events = [{ id: "event-1" }];
    getMock.mockResolvedValueOnce(events as never);

    await expect(fetchEvents({ page: 2, limit: 10 })).resolves.toBe(events);
    expect(getMock).toHaveBeenCalledWith("/events?page=2&limit=10");
  });

  it("fetchEventById returns null for an API 404", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    getMock.mockRejectedValueOnce(new ApiError("Not found", 404));

    await expect(fetchEventById("missing")).resolves.toBeNull();
  });

  it("fetchEventsByOrganizer sends the filtered API request", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    const events = [{ id: "event-1" }];
    getMock.mockResolvedValueOnce(events as never);

    await expect(fetchEventsByOrganizer("org-1")).resolves.toBe(events);
    expect(getMock).toHaveBeenCalledWith("/events?organizerId=org-1");
  });
});
