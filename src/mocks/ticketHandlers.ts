import { http, HttpResponse } from 'msw';

export const ticketHandlers = [
  http.post('/api/tickets/verify', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { ticketId?: string };
    if (body.ticketId === 'invalid') {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    return HttpResponse.json({
      valid: true,
      ticketId: body.ticketId || 't-123',
      eventName: 'Veritix Launch Party',
      attendeeName: 'Alice Smith',
      status: 'VALID',
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/tickets/check-in', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { ticketId?: string };
    if (body.ticketId === 'used') {
      return HttpResponse.json({ error: 'Ticket already checked in' }, { status: 400 });
    }
    return HttpResponse.json({
      success: true,
      ticketId: body.ticketId || 't-123',
      checkInTime: new Date().toISOString(),
    });
  }),
];
