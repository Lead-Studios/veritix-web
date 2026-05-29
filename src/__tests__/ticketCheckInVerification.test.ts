import { describe, it, expect, vi, beforeEach } from 'vitest';
import { markTicketUsed, isTicketUsed } from '@/lib/ticketCheckIn';
import { verifyTicket, checkInTicket } from '@/lib/ticketVerification';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

// ---------------------------------------------------------------------------
// ticketCheckIn
// ---------------------------------------------------------------------------

describe('ticketCheckIn', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  describe('markTicketUsed', () => {
    it('resolves without error on successful check-in', async () => {
      global.fetch = mockFetch(200, { success: true });
      await expect(markTicketUsed('TKT-001')).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith('/api/tickets/check-in', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ ticketCode: 'TKT-001' }),
      }));
    });

    it('throws when the ticket is already checked in (non-ok response)', async () => {
      global.fetch = mockFetch(409, { message: 'Already checked in' });
      await expect(markTicketUsed('TKT-USED')).rejects.toThrow('Failed to record check-in');
    });

    it('throws on network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));
      await expect(markTicketUsed('TKT-001')).rejects.toThrow();
    });
  });

  describe('isTicketUsed', () => {
    it('returns true when backend reports checkedIn: true', async () => {
      global.fetch = mockFetch(200, { checkedIn: true });
      await expect(isTicketUsed('TKT-001')).resolves.toBe(true);
    });

    it('returns false when backend reports checkedIn: false', async () => {
      global.fetch = mockFetch(200, { checkedIn: false });
      await expect(isTicketUsed('TKT-001')).resolves.toBe(false);
    });

    it('returns false on non-ok response', async () => {
      global.fetch = mockFetch(404, {});
      await expect(isTicketUsed('TKT-MISSING')).resolves.toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// ticketVerification
// ---------------------------------------------------------------------------

describe('ticketVerification', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  describe('verifyTicket', () => {
    it('returns valid result for a valid token', async () => {
      global.fetch = mockFetch(200, { valid: true, holderName: 'Alice', ticketType: 'VIP', event: 'Fest' });
      const result = await verifyTicket('VALID-CODE');
      expect(result.valid).toBe(true);
      expect(result.holderName).toBe('Alice');
    });

    it('returns invalid result for an expired token', async () => {
      global.fetch = mockFetch(200, { valid: false, errorMessage: 'Token expired' });
      const result = await verifyTicket('EXPIRED-CODE');
      expect(result.valid).toBe(false);
      expect(result.errorMessage).toBe('Token expired');
    });

    it('returns invalid result for a revoked token', async () => {
      global.fetch = mockFetch(200, { valid: false, errorMessage: 'Token revoked' });
      const result = await verifyTicket('REVOKED-CODE');
      expect(result.valid).toBe(false);
    });

    it('returns invalid with error message when service is unavailable', async () => {
      global.fetch = mockFetch(503, {});
      const result = await verifyTicket('ANY-CODE');
      expect(result.valid).toBe(false);
      expect(result.errorMessage).toMatch(/unavailable/i);
    });
  });

  describe('checkInTicket', () => {
    it('returns success: true on successful check-in', async () => {
      global.fetch = mockFetch(200, { success: true, message: 'Checked in' });
      const result = await checkInTicket('TKT-001');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Checked in');
    });

    it('returns success: false when ticket is already used', async () => {
      global.fetch = mockFetch(409, { message: 'Already checked in' });
      const result = await checkInTicket('TKT-USED');
      expect(result.success).toBe(false);
    });

    it('returns success: false on network error', async () => {
      global.fetch = mockFetch(500, {});
      const result = await checkInTicket('TKT-001');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/failed/i);
    });
  });
});
