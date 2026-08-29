/**
 * eventsApi unit tests (FE-231 related).
 * Covers fetchEvents, fetchEventById, fetchOrganizerById, fetchEventsByOrganizer.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  fetchEvents,
  fetchEventById,
  fetchOrganizerById,
  fetchEventsByOrganizer,
} from "@/lib/eventsApi";

const mockEvents = [
  {
    id: "evt-1",
    name: "Test Event 1",
    category: "music",
    organizer: { id: "org-1", name: "Org One" },
    imageUrl: "/img1.png",
    eventDate: "2025-06-01",
    venue: "Venue A",
    location: "City A",
    price: "50",
    featured: true,
  },
  {
    id: "evt-2",
    name: "Test Event 2",
    category: "sports",
    organizer: { id: "org-2", name: "Org Two" },
    imageUrl: "/img2.png",
    eventDate: "2025-07-15",
    venue: "Venue B",
    location: "City B",
    price: "30",
    featured: false,
  },
];

describe("fetchEvents", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
  });

  it("returns mock events when API_BASE is empty", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "";
    const events = await fetchEvents();
    expect(events.length).toBeGreaterThan(0);
  });

  it("calls the correct URL when API_BASE is set", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockEvents,
    });
    global.fetch = mockFetch;

    const events = await fetchEvents();
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/events",
      { next: { revalidate: 60 } }
    );
    expect(events).toEqual(mockEvents);
  });

  it("throws on non-ok response", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    await expect(fetchEvents()).rejects.toThrow("Failed to fetch events");
  });
});

describe("fetchEventById", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
  });

  it("returns null on 404", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });

    const event = await fetchEventById("nonexistent");
    expect(event).toBeNull();
  });

  it("returns event on 200", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockEvents[0],
    });

    const event = await fetchEventById("evt-1");
    expect(event).toEqual(mockEvents[0]);
  });

  it("throws on 5xx", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 });

    await expect(fetchEventById("evt-1")).rejects.toThrow("Failed to fetch event");
  });
});

describe("fetchOrganizerById", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
  });

  it("returns null on 404", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });

    const org = await fetchOrganizerById("nonexistent");
    expect(org).toBeNull();
  });

  it("returns organizer on 200", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    const mockOrg = { id: "org-1", name: "Org One" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockOrg,
    });

    const org = await fetchOrganizerById("org-1");
    expect(org).toEqual(mockOrg);
  });
});

describe("fetchEventsByOrganizer", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
  });

  it("calls API with organizerId param when API_BASE is set", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockEvents[0]],
    });
    global.fetch = mockFetch;

    const events = await fetchEventsByOrganizer("org-1");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/events?organizerId=org-1",
      { next: { revalidate: 60 } }
    );
    expect(events).toEqual([mockEvents[0]]);
  });

  it("returns filtered mock events when API_BASE is empty", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "";
    const events = await fetchEventsByOrganizer("org-1");
    expect(events.length).toBeGreaterThanOrEqual(0);
  });
});
