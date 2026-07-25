import { http, HttpResponse } from "msw";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE}/auth/login`, () => {
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

  http.post(`${API_BASE}/auth/logout`, () => {
    return HttpResponse.json({ message: "Logged out successfully" });
  }),

  http.post(`${API_BASE}/auth/refresh`, () => {
    return HttpResponse.json({
      accessToken: "mock-new-access-token",
    });
  }),

  // Events endpoints
  http.get(`${API_BASE}/events`, ({ request }) => {
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

  http.get(`${API_BASE}/events/:id`, ({ params }) => {
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
  http.post(`${API_BASE}/tickets/purchase`, () => {
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

  http.get(`${API_BASE}/tickets/user`, () => {
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