import { http, HttpResponse } from 'msw';

/**
 * MSW handlers mirroring the documented backend contract for
 * POST /api/tickets/verify and POST /api/tickets/check-in.
 *
 * Send { code: 'INVALID-CODE' } to simulate a failed verification.
 * Send { code: 'USED-CODE' } to simulate a failed check-in.
 */
export const ticketVerificationHandlers = [
  http.post('/api/tickets/verify', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { code?: string };

    if (body.code === 'INVALID-CODE') {
      return HttpResponse.json(
        { message: 'Ticket not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      valid: true,
      holderName: 'Jane Doe',
      ticketType: 'VIP',
      event: 'Veritix Launch Party',
    });
  }),

  http.post('/api/tickets/check-in', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { code?: string };

    if (body.code === 'USED-CODE') {
      return HttpResponse.json(
        { message: 'Ticket already checked in' },
        { status: 409 },
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Checked in successfully',
    });
  }),
];