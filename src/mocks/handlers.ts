import { http, HttpResponse } from "msw";
import { API_ROUTES, buildUrl } from "@/lib/api-routes";

export const handlers = [
  // Auth endpoints
  http.post(buildUrl(API_ROUTES.auth.login), () => {
    return HttpResponse.json({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: {
        id: "user-123",
        email: "user@example.com",
        name: "Test User",
        role: "attendee",
      },
    });
  }),

  http.post(buildUrl(API_ROUTES.auth.logout), () => {
    return HttpResponse.json({ message: "Logged out successfully" });
  }),

  http.post(buildUrl(API_ROUTES.auth.refresh), () => {
    return HttpResponse.json({
      accessToken: "mock-new-access-token",
    });
  }),

  // Events endpoints
  http.get(buildUrl(API_ROUTES.events.list), ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "10";

    return HttpResponse.json({
      data: [
        {
          id: "evt-001",
          title: "Mock Event 1",
          description: "A mock event for testing",
          date: new Date(Date.now() + 86400000).toISOString(),
          location: "Lagos, Nigeria",
          ticketPrice: 5000,
          availableTickets: 100,
          category: "music",
          imageUrl: "https://placehold.co/600x400",
        },
      ],
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: 1,
        totalPages: 1,
      },
    });
  }),

  http.get(buildUrl("/events/:id"), ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: "Mock Event Detail",
      description: "Detailed mock event description",
      date: new Date(Date.now() + 86400000).toISOString(),
      location: "Abuja, Nigeria",
      ticketPrice: 8000,
      availableTickets: 50,
      category: "conference",
      imageUrl: "https://placehold.co/1200x600",
      organizer: {
        id: "org-001",
        name: "Mock Organizer",
      },
    });
  }),

  // Tickets endpoints
  http.post(buildUrl(API_ROUTES.tickets.purchase), () => {
    return HttpResponse.json({
      ticketId: "ticket-001",
      eventId: "evt-001",
      userId: "user-123",
      quantity: 1,
      totalAmount: 5000,
      status: "confirmed",
      purchasedAt: new Date().toISOString(),
    });
  }),

  http.post(buildUrl(API_ROUTES.tickets.verify), async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { ticketId?: string };
    if (body.ticketId === "invalid") {
      return HttpResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    return HttpResponse.json({
      valid: true,
      ticketId: body.ticketId || "t-123",
      eventName: "Veritix Launch Party",
      attendeeName: "Alice Smith",
      status: "VALID",
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(buildUrl(API_ROUTES.tickets.checkIn), async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { ticketCode?: string; ticketId?: string };
    const ticketCode = body.ticketCode || body.ticketId;
    if (ticketCode === "used") {
      return HttpResponse.json({ error: "Ticket already checked in" }, { status: 400 });
    }
    return HttpResponse.json({
      success: true,
      ticketId: ticketCode || "t-123",
      checkInTime: new Date().toISOString(),
    });
  }),

  http.get(buildUrl(API_ROUTES.tickets.userTickets), () => {
    return HttpResponse.json({
      data: [
        {
          id: "ticket-001",
          event: {
            id: "evt-001",
            title: "Mock Event 1",
            date: new Date(Date.now() + 86400000).toISOString(),
          },
          quantity: 1,
          status: "confirmed",
        },
      ],
    });
  }),
];