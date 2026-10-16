import { z } from 'zod';

/**
 * Validation rules for creating and editing an event.
 *
 * Shared by the dashboard form and the `/api/events` routes so the two cannot
 * drift: a rule the form enforces but the server does not is a rule any
 * `curl` can skip, and a rule only the server enforces is an error the user
 * sees after they have already pressed submit.
 */

const requiredText = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

const dateString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => !Number.isNaN(Date.parse(value)), `${label} is not a valid date`);

export const ticketTierInputSchema = z.object({
  name: requiredText('Tier name', 80),
  /** Integer minor units, so a price never picks up floating-point cents. */
  priceMinor: z.number().int('Price must be a whole number of cents').min(0, 'Price cannot be negative'),
  currency: z
    .string()
    .trim()
    .regex(/^[A-Z]{3}$/, 'Currency must be a three-letter code'),
  quantityTotal: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const revenueSplitInputSchema = z.object({
  recipient: requiredText('Split recipient', 120),
  percent: z
    .number()
    .gt(0, 'Split percentage must be greater than 0')
    .max(100, 'Split percentage cannot exceed 100'),
});

/** The basics the first step of the form collects. */
export const eventBasicsObject = z.object({
  title: requiredText('Title', 120),
  description: requiredText('Description', 5000),
  venue: requiredText('Venue', 160),
  city: requiredText('City', 80),
  startsAt: dateString('Start date'),
  endsAt: dateString('End date'),
});

export const eventInputObject = eventBasicsObject.extend({
  tiers: z.array(ticketTierInputSchema).min(1, 'Add at least one ticket tier').max(20),
  /** Empty means the organizer keeps all of the revenue. */
  splits: z.array(revenueSplitInputSchema).max(20).default([]),
});

/** Splits are summed in hundredths so 33.33 + 33.33 + 33.34 is exactly 100. */
function splitsTotal(splits: { percent: number }[]): number {
  return splits.reduce((sum, split) => sum + Math.round(split.percent * 100), 0) / 100;
}

type DateRange = { startsAt: string; endsAt: string };

function checkDateOrder(value: DateRange, ctx: z.RefinementCtx) {
  const start = Date.parse(value.startsAt);
  const end = Date.parse(value.endsAt);
  // Invalid dates already carry their own message from `dateString`.
  if (Number.isNaN(start) || Number.isNaN(end)) return;
  if (end < start) {
    ctx.addIssue({
      code: 'custom',
      path: ['endsAt'],
      message: 'End date cannot be before the start date',
    });
  }
}

export const eventBasicsSchema = eventBasicsObject.superRefine(checkDateOrder);

export const eventInputSchema = eventInputObject.superRefine((value, ctx) => {
  checkDateOrder(value, ctx);

  if (value.splits.length > 0) {
    const total = splitsTotal(value.splits);
    if (total !== 100) {
      ctx.addIssue({
        code: 'custom',
        path: ['splits'],
        message: `Revenue splits must total 100% (currently ${total}%)`,
      });
    }
  }
});

export type EventInput = z.infer<typeof eventInputSchema>;
export type TicketTierInput = z.infer<typeof ticketTierInputSchema>;

/** Flatten zod issues into the `{ field, message }` shape the API returns. */
export function toFieldErrors(error: z.ZodError): { field: string; message: string }[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}
