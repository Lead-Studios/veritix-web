import { describe, it, expect } from 'vitest';
import { createEventSchema } from '../createEventValidation';

describe('createEventSchema — superRefine Validation Branches', () => {
  const validBaseEvent = {
    title: 'Veritix Launch Summit',
    description: 'Annual web3 ticketing event',
    startDate: '2026-09-01T10:00:00.000Z',
    endDate: '2026-09-01T18:00:00.000Z',
    ticketClosingDate: '2026-08-31T23:59:59.000Z',
    treasuryAddress: 'GABC1234567890123456789012345678901234567890123456789012',
    recurrence: {
      isRecurring: false,
    },
    tickets: [
      { name: 'General Admission', price: 10, quantity: 100 },
      { name: 'VIP Pass', price: 50, quantity: 20 },
    ],
  };

  it('should pass validation with valid event payload', () => {
    const result = createEventSchema.safeParse(validBaseEvent);
    expect(result.success).toBe(true);
  });

  // ─── 1. End Date Before Start Date ──────────────────────────────────────────

  it('should produce an error on endDate when endDate is before startDate', () => {
    const invalidPayload = {
      ...validBaseEvent,
      startDate: '2026-09-02T10:00:00.000Z',
      endDate: '2026-09-01T10:00:00.000Z',
    };

    const result = createEventSchema.safeParse(invalidPayload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const endDateError = result.error.issues.find(
        (issue) => issue.path.join('.') === 'endDate',
      );
      expect(endDateError).toBeDefined();
      expect(endDateError?.message).toMatch(/end date must be after start date/i);
    }
  });

  // ─── 2. Closing Date Before Start Date ──────────────────────────────────────

  it('should produce an error when ticketClosingDate is after or equal to startDate', () => {
    const invalidPayload = {
      ...validBaseEvent,
      startDate: '2026-09-01T10:00:00.000Z',
      ticketClosingDate: '2026-09-02T10:00:00.000Z',
    };

    const result = createEventSchema.safeParse(invalidPayload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const closingDateError = result.error.issues.find(
        (issue) => issue.path.join('.') === 'ticketClosingDate',
      );
      expect(closingDateError).toBeDefined();
      expect(closingDateError?.message).toMatch(
        /closing date must be before start date/i,
      );
    }
  });

  // ─── 3. Invalid Stellar Treasury Address Format ─────────────────────────────

  it('should produce formatted error when treasuryAddress is not a valid Stellar public key', () => {
    const invalidPayload = {
      ...validBaseEvent,
      treasuryAddress: 'invalid-stellar-address-format',
    };

    const result = createEventSchema.safeParse(invalidPayload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const treasuryError = result.error.issues.find(
        (issue) => issue.path.join('.') === 'treasuryAddress',
      );
      expect(treasuryError).toBeDefined();
      expect(treasuryError?.message).toMatch(/invalid stellar public key/i);
    }
  });

  // ─── 4. Recurrence End Type 'date' Missing 'until' ──────────────────────────

  it('should produce an error when recurrence endType is "date" but "until" is missing', () => {
    const invalidPayload = {
      ...validBaseEvent,
      recurrence: {
        isRecurring: true,
        frequency: 'weekly',
        endType: 'date',
        // until field omitted
      },
    };

    const result = createEventSchema.safeParse(invalidPayload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const recurrenceError = result.error.issues.find(
        (issue) => issue.path.join('.') === 'recurrence.until',
      );
      expect(recurrenceError).toBeDefined();
      expect(recurrenceError?.message).toMatch(/until date is required/i);
    }
  });

  // ─── 5. Duplicate Ticket Names across Indices ──────────────────────────────

  it('should produce errors on all conflicting indices when duplicate ticket names exist', () => {
    const invalidPayload = {
      ...validBaseEvent,
      tickets: [
        { name: 'VIP Pass', price: 50, quantity: 20 },
        { name: 'Early Bird', price: 15, quantity: 50 },
        { name: 'VIP Pass', price: 60, quantity: 10 }, // Duplicate of index 0
      ],
    };

    const result = createEventSchema.safeParse(invalidPayload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const ticket0Error = result.error.issues.find(
        (issue) => issue.path.join('.') === 'tickets.0.name',
      );
      const ticket2Error = result.error.issues.find(
        (issue) => issue.path.join('.') === 'tickets.2.name',
      );

      expect(ticket0Error).toBeDefined();
      expect(ticket2Error).toBeDefined();
      expect(ticket0Error?.message).toMatch(/duplicate ticket name/i);
      expect(ticket2Error?.message).toMatch(/duplicate ticket name/i);
    }
  });
});
