import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { ticketHandlers } from "../mocks/ticketHandlers";

const server = setupServer(...ticketHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Ticket API MSW Contract Tests", () => {
  it("POST /api/tickets/verify returns valid TicketVerificationResult shape", async () => {
    const res = await fetch("/api/tickets/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: "t-100" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.valid).toBe(true);
    expect(data.ticketId).toBe("t-100");
    expect(data.status).toBe("VALID");
  });

  it("POST /api/tickets/verify handles error response shape", async () => {
    const res = await fetch("/api/tickets/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: "invalid" }),
    });
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Ticket not found");
  });

  it("POST /api/tickets/check-in returns success shape", async () => {
    const res = await fetch("/api/tickets/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: "t-100" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.checkInTime).toBeDefined();
  });
});
