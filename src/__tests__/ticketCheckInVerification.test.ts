import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { ticketVerificationHandlers } from '../mocks/ticketVerificationHandlers';

// apiClient reads NEXT_PUBLIC_API_BASE_URL at import time and builds request
// URLs from it directly, so it must be set before the module is evaluated,
// otherwise requests are sent to "undefined/api/..." instead of "/api/...".
process.env.NEXT_PUBLIC_API_BASE_URL = '';
const { verifyTicket, checkInTicket } = await import('@/lib/ticketVerification');

const server = setupServer(...ticketVerificationHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  localStorage.setItem('auth_token', 'test-token');
});

describe('Ticket API MSW contract tests', () => {
  describe('verifyTicket', () => {
    it('parses a successful response into TicketVerificationResult', async () => {
      const result = await verifyTicket('VALID-CODE');

      expect(result).toEqual({
        valid: true,
        holderName: 'Jane Doe',
        ticketType: 'VIP',
        event: 'Veritix Launch Party',
      });
    });

    it('returns an invalid result when the API responds with a non-OK status', async () => {
      const result = await verifyTicket('INVALID-CODE');

      expect(result.valid).toBe(false);
      expect(result.errorMessage).toMatch(/unavailable/i);
    });
  });

  describe('checkInTicket', () => {
    it('parses a successful check-in response shape', async () => {
      const result = await checkInTicket('VALID-CODE');

      expect(result).toEqual({
        success: true,
        message: 'Checked in successfully',
      });
    });

    it('returns a failure result when the API responds with a non-OK status', async () => {
      const result = await checkInTicket('USED-CODE');

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/failed/i);
    });
  });
});