import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createEventSchema,
  parseCreateEventErrors,
  sectionForField,
  sectionIdForField,
} from "../lib/createEventValidation";
import { submitCreateEvent } from "../lib/createEventSubmit";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const baseTicket = {
  name: "General Admission",
  quantity: 100,
  price: "0.05",
  description: "",
  transferable: true,
  resellable: false,
  resellPriceLimit: "",
};

const validPhysicalData = {
  title: "My Event",
  description: "A great event with lots of fun activities.",
  coverImage: new File(["img"], "cover.jpg", { type: "image/jpeg" }),
  gallery: [],
  startDate: "2026-09-01",
  startTime: "10:00",
  endDate: "2026-09-01",
  endTime: "18:00",
  eventType: "physical" as const,
  venueName: "Grand Hall",
  address: "123 Main St",
  city: "Lagos",
  state: "Lagos",
  zipCode: "100001",
  latitude: null,
  longitude: null,
  streamingUrl: "",
  tickets: [baseTicket],
  blockchainNetwork: "ethereum" as const,
  treasuryAddress: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
  creatorRoyalty: 5,
};

function parse(data: object) {
  return createEventSchema.safeParse(data);
}

// ─── createEventSchema ────────────────────────────────────────────────────────

describe("createEventSchema", () => {
  // Required fields
  it("passes with valid physical event data", () => {
    expect(parse(validPhysicalData).success).toBe(true);
  });

  it("fails when title is empty", () => {
    const result = parse({ ...validPhysicalData, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("title"))).toBe(true);
    }
  });

  it("fails when description is shorter than 10 characters", () => {
    const result = parse({ ...validPhysicalData, description: "Short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("description"))).toBe(true);
    }
  });

  it("fails when coverImage is null", () => {
    const result = parse({ ...validPhysicalData, coverImage: null });
    expect(result.success).toBe(false);
  });

  it("fails when tickets array is empty", () => {
    const result = parse({ ...validPhysicalData, tickets: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("tickets"))).toBe(true);
    }
  });

  // Date-range rule
  it("fails when end date/time is before start date/time", () => {
    const result = parse({
      ...validPhysicalData,
      startDate: "2026-09-01",
      startTime: "18:00",
      endDate: "2026-09-01",
      endTime: "10:00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("endDate"))).toBe(true);
    }
  });

  it("fails when end date/time equals start date/time", () => {
    const result = parse({
      ...validPhysicalData,
      startDate: "2026-09-01",
      startTime: "10:00",
      endDate: "2026-09-01",
      endTime: "10:00",
    });
    expect(result.success).toBe(false);
  });

  // Physical event location rules
  it("fails when venueName is missing for physical event", () => {
    const result = parse({ ...validPhysicalData, venueName: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("venueName"))).toBe(true);
    }
  });

  it("fails when address is missing for physical event", () => {
    const result = parse({ ...validPhysicalData, address: "" });
    expect(result.success).toBe(false);
  });

  it("fails when city is missing for physical event", () => {
    const result = parse({ ...validPhysicalData, city: "" });
    expect(result.success).toBe(false);
  });

  // Online event rules
  it("fails when streamingUrl is missing for online event", () => {
    const result = parse({
      ...validPhysicalData,
      eventType: "online",
      streamingUrl: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("streamingUrl"))).toBe(true);
    }
  });

  it("fails when streamingUrl is not a valid URL for online event", () => {
    const result = parse({
      ...validPhysicalData,
      eventType: "online",
      streamingUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("passes for online event with valid streamingUrl", () => {
    const result = parse({
      ...validPhysicalData,
      eventType: "online",
      venueName: "",
      address: "",
      city: "",
      streamingUrl: "https://stream.example.com/live",
    });
    expect(result.success).toBe(true);
  });

  // Treasury address validation
  it("fails with invalid Ethereum treasury address", () => {
    const result = parse({ ...validPhysicalData, treasuryAddress: "0xinvalid" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("treasuryAddress"))).toBe(true);
    }
  });

  it("fails with invalid Solana treasury address", () => {
    const result = parse({
      ...validPhysicalData,
      blockchainNetwork: "solana",
      treasuryAddress: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    });
    expect(result.success).toBe(false);
  });

  it("passes with valid Solana treasury address", () => {
    const result = parse({
      ...validPhysicalData,
      blockchainNetwork: "solana",
      treasuryAddress: "So11111111111111111111111111111111111111112",
    });
    expect(result.success).toBe(true);
  });

  // Ticket sub-schema
  it("fails when ticket quantity is less than 1", () => {
    const result = parse({
      ...validPhysicalData,
      tickets: [{ ...baseTicket, quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("fails when ticket price is negative", () => {
    const result = parse({
      ...validPhysicalData,
      tickets: [{ ...baseTicket, price: "-1" }],
    });
    expect(result.success).toBe(false);
  });

  it("fails when ticket name is empty", () => {
    const result = parse({
      ...validPhysicalData,
      tickets: [{ ...baseTicket, name: "" }],
    });
    expect(result.success).toBe(false);
  });
});

// ─── parseCreateEventErrors ───────────────────────────────────────────────────

describe("parseCreateEventErrors", () => {
  it("maps Zod issues to a flat record keyed by path", () => {
    const result = parse({ ...validPhysicalData, title: "" });
    if (!result.success) {
      const errors = parseCreateEventErrors(result.error.issues);
      expect(errors["title"]).toBeDefined();
    }
  });

  it("returns empty object when issues array is empty", () => {
    expect(parseCreateEventErrors([])).toEqual({});
  });

  it("does not overwrite the first message for a duplicate path", () => {
    const issues = [
      { path: ["title"], message: "First error", code: "custom" as const },
      { path: ["title"], message: "Second error", code: "custom" as const },
    ];
    const errors = parseCreateEventErrors(issues as never);
    expect(errors["title"]).toBe("First error");
  });
});

// ─── sectionForField ──────────────────────────────────────────────────────────

describe("sectionForField", () => {
  it.each([
    ["title", "Basic Information"],
    ["description", "Basic Information"],
    ["coverImage", "Basic Information"],
    ["startDate", "Date & Time"],
    ["endTime", "Date & Time"],
    ["venueName", "Location"],
    ["streamingUrl", "Location"],
    ["tickets.0.name", "Ticket Information"],
    ["blockchainNetwork", "Blockchain Setting"],
    ["treasuryAddress", "Blockchain Setting"],
    ["unknown", "General"],
  ])("field '%s' → section '%s'", (field, expected) => {
    expect(sectionForField(field)).toBe(expected);
  });
});

// ─── sectionIdForField ────────────────────────────────────────────────────────

describe("sectionIdForField", () => {
  it.each([
    ["title", "section-basic"],
    ["startDate", "section-datetime"],
    ["city", "section-location"],
    ["tickets.0.price", "section-tickets"],
    ["creatorRoyalty", "section-blockchain"],
    ["unknown", ""],
  ])("field '%s' → id '%s'", (field, expected) => {
    expect(sectionIdForField(field)).toBe(expected);
  });
});

// ─── submitCreateEvent ────────────────────────────────────────────────────────

describe("submitCreateEvent", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns id and slug on successful submit", async () => {
    const mockResponse = { id: "evt-123", slug: "my-event" };
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );

    const result = await submitCreateEvent(validPhysicalData as never);
    expect(result).toEqual(mockResponse);
  });

  it("sends a POST request to /api/events", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "1", slug: "s" }), { status: 200 })
    );

    await submitCreateEvent(validPhysicalData as never);
    expect(fetch).toHaveBeenCalledWith("/api/events", expect.objectContaining({ method: "POST" }));
  });

  it("throws an error when the response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Validation failed" }), { status: 422 })
    );

    await expect(submitCreateEvent(validPhysicalData as never)).rejects.toThrow(
      "Validation failed"
    );
  });

  it("throws a generic error when response body has no message", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("{}", { status: 500 })
    );

    await expect(submitCreateEvent(validPhysicalData as never)).rejects.toThrow(
      "Failed to create event. Please try again."
    );
  });

  it("appends File values directly to FormData", async () => {
    let capturedBody: FormData | undefined;
    vi.mocked(fetch).mockImplementationOnce(async (_url, init) => {
      capturedBody = init?.body as FormData;
      return new Response(JSON.stringify({ id: "1", slug: "s" }), { status: 200 });
    });

    await submitCreateEvent(validPhysicalData as never);
    expect(capturedBody?.get("coverImage")).toBeInstanceOf(File);
  });
});
