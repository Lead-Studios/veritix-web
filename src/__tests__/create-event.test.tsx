import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewEventPage from '@/app/(protected)/dashboard/events/new/page';
import { eventInputSchema, type EventInput } from '@/lib/event-schema';

const validInput = (): EventInput => ({
  title: 'Lagos Sound Festival',
  description: 'Two stages, twelve acts.',
  venue: 'Eko Convention Centre',
  city: 'Lagos',
  startsAt: '2026-10-17T16:00:00.000Z',
  endsAt: '2026-10-17T23:00:00.000Z',
  tiers: [{ name: 'General', priceMinor: 5_000, currency: 'USD', quantityTotal: 100 }],
  splits: [],
});

/** Messages zod reported for one field path, e.g. `endsAt` or `splits`. */
function errorsFor(input: unknown, field: string): string[] {
  const result = eventInputSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues
    .filter((issue) => issue.path.join('.') === field)
    .map((issue) => issue.message);
}

describe('event creation schema', () => {
  it('accepts a complete event', () => {
    expect(eventInputSchema.safeParse(validInput()).success).toBe(true);
  });

  describe('required fields', () => {
    it.each([
      ['title', 'Title is required'],
      ['description', 'Description is required'],
      ['venue', 'Venue is required'],
      ['city', 'City is required'],
      ['startsAt', 'Start date is required'],
      ['endsAt', 'End date is required'],
    ] as const)('rejects an empty %s', (field, message) => {
      expect(errorsFor({ ...validInput(), [field]: '' }, field)).toContain(message);
    });

    it('treats whitespace-only text as empty', () => {
      expect(errorsFor({ ...validInput(), title: '   ' }, 'title')).toContain(
        'Title is required',
      );
    });

    it.each(['title', 'venue', 'city', 'startsAt', 'endsAt', 'tiers'])(
      'rejects a missing %s',
      (field) => {
        const input: Record<string, unknown> = validInput();
        delete input[field];
        expect(errorsFor(input, field).length).toBeGreaterThan(0);
      },
    );
  });

  describe('dates', () => {
    it('rejects an end date before the start date', () => {
      const input = {
        ...validInput(),
        startsAt: '2026-10-17T16:00:00.000Z',
        endsAt: '2026-10-16T16:00:00.000Z',
      };
      expect(errorsFor(input, 'endsAt')).toContain('End date cannot be before the start date');
    });

    it('allows a single-day event where the dates are equal', () => {
      const input = { ...validInput(), startsAt: '2026-10-17', endsAt: '2026-10-17' };
      expect(eventInputSchema.safeParse(input).success).toBe(true);
    });

    it('rejects an unparseable date', () => {
      expect(errorsFor({ ...validInput(), startsAt: 'next friday' }, 'startsAt')).toContain(
        'Start date is not a valid date',
      );
    });
  });

  describe('tiers', () => {
    it('rejects a submission with zero tiers', () => {
      expect(errorsFor({ ...validInput(), tiers: [] }, 'tiers')).toContain(
        'Add at least one ticket tier',
      );
    });

    it('rejects a tier with no tickets', () => {
      const input = {
        ...validInput(),
        tiers: [{ name: 'General', priceMinor: 5_000, currency: 'USD', quantityTotal: 0 }],
      };
      expect(errorsFor(input, 'tiers.0.quantityTotal')).toContain('Quantity must be at least 1');
    });
  });

  describe('revenue splits', () => {
    it('accepts no splits (the organizer keeps everything)', () => {
      expect(eventInputSchema.safeParse({ ...validInput(), splits: [] }).success).toBe(true);
    });

    it('accepts splits that total exactly 100%', () => {
      const splits = [
        { recipient: 'GA', percent: 33.33 },
        { recipient: 'GB', percent: 33.33 },
        { recipient: 'GC', percent: 33.34 },
      ];
      expect(eventInputSchema.safeParse({ ...validInput(), splits }).success).toBe(true);
    });

    it('rejects splits under 100%', () => {
      const splits = [
        { recipient: 'GA', percent: 50 },
        { recipient: 'GB', percent: 40 },
      ];
      expect(errorsFor({ ...validInput(), splits }, 'splits')).toContain(
        'Revenue splits must total 100% (currently 90%)',
      );
    });

    it('rejects splits over 100%', () => {
      const splits = [
        { recipient: 'GA', percent: 70 },
        { recipient: 'GB', percent: 40 },
      ];
      expect(errorsFor({ ...validInput(), splits }, 'splits')).toContain(
        'Revenue splits must total 100% (currently 110%)',
      );
    });
  });
});

describe('NewEventPage', () => {
  it('shows no errors before the form is touched', () => {
    render(<NewEventPage />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('flags the remaining required fields once the user starts typing', async () => {
    const user = userEvent.setup();
    render(<NewEventPage />);

    await user.type(screen.getByLabelText(/^title/i), 'Lagos Sound Festival');

    expect(screen.getByText('Venue is required')).toBeInTheDocument();
    expect(screen.getByText('City is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^venue/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Fill in every required field');
  });

  it('flags an end date before the start date', async () => {
    const user = userEvent.setup();
    render(<NewEventPage />);

    await user.type(screen.getByLabelText('Start date'), '2026-10-17{Enter}');
    await user.type(screen.getByLabelText('End date'), '2026-10-16{Enter}');

    expect(screen.getByText('End date cannot be before the start date')).toBeInTheDocument();
  });

  it('does not flag an end date on or after the start date', async () => {
    const user = userEvent.setup();
    render(<NewEventPage />);

    await user.type(screen.getByLabelText('Start date'), '2026-10-17{Enter}');
    await user.type(screen.getByLabelText('End date'), '2026-10-18{Enter}');

    expect(
      screen.queryByText('End date cannot be before the start date'),
    ).not.toBeInTheDocument();
  });
});
