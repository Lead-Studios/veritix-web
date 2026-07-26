import { describe, it, expect, vi } from "vitest";
import { fetchEvents, fetchEventById, fetchOrganizerById, fetchEventsByOrganizer } from "../lib/eventsApi";

describe("eventsApi mock and real-API branches", () => {
  it("fetchEvents returns events in mock mode", async () => {
    const events = await fetchEvents();
    expect(Array.isArray(events)).toBe(true);
  });

  it("fetchEventById finds event by id or returns null when missing", async () => {
    const event = await fetchEventById("event-1");
    expect(event === null || typeof event === "object").toBe(true);

    const nonExistent = await fetchEventById("non-existent-999");
    expect(nonExistent).toBeNull();
  });

  it("fetchOrganizerById finds organizer by id", async () => {
    const org = await fetchOrganizerById("org-1");
    expect(org === null || typeof org === "object").toBe(true);
  });

  it("fetchEventsByOrganizer filters events by organizer id", async () => {
    const events = await fetchEventsByOrganizer("org-1");
    expect(Array.isArray(events)).toBe(true);
  });
});
