import { describe, it, expect } from "vitest";
import { API_ROUTES, buildUrl } from "@/lib/api-routes";

describe("API_ROUTES", () => {
  it("exports a typed object with expected top-level keys", () => {
    expect(API_ROUTES).toBeDefined();
    expect(typeof API_ROUTES).toBe("object");

    const keys = Object.keys(API_ROUTES);
    expect(keys).toContain("auth");
    expect(keys).toContain("events");
    expect(keys).toContain("tickets");
    expect(keys).toContain("wallet");
    expect(keys).toContain("organizer");
    expect(keys).toContain("notifications");
    expect(keys).toContain("upload");
  });

  it("auth routes are string values", () => {
    expect(typeof API_ROUTES.auth.login).toBe("string");
    expect(API_ROUTES.auth.login).toBe("/auth/login");
    expect(typeof API_ROUTES.auth.register).toBe("string");
  });

  it("events detail returns a path with the id", () => {
    const path = API_ROUTES.events.detail("abc-123");
    expect(path).toBe("/events/abc-123");
  });

  it("tickets verify is a string", () => {
    expect(typeof API_ROUTES.tickets.verify).toBe("string");
    expect(API_ROUTES.tickets.verify).toBe("/tickets/verify");
  });

  it("events checkInCount is a function returning correct path", () => {
    const path = API_ROUTES.events.checkInCount("evt-1");
    expect(path).toBe("/events/evt-1/check-ins/count");
  });
});

describe("buildUrl", () => {
  it("prepends the API base URL to a path", () => {
    const url = buildUrl("/auth/login");
    expect(url).toContain("/auth/login");
    expect(url).toMatch(/^https?:\/\//);
  });

  it("strips trailing slash from base URL", () => {
    const url = buildUrl("/events");
    expect(url).not.toMatch(/\/\/\//);
  });
});
