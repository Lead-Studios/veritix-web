import { z } from "zod";

const ticketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  quantity: z.number({ error: "Quantity must be a number" }).int().min(1, "Quantity must be at least 1"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, "Price must be a valid non-negative number"),
  description: z.string().optional(),
  transferable: z.boolean(),
  resellable: z.boolean(),
  resellPriceLimit: z.string().optional(),
});

const recurrenceSchema = z.object({
  frequency: z.enum(["none", "daily", "weekly", "monthly", "custom"]),
  interval: z.number().int().min(1, "Interval must be at least 1").max(365),
  customUnit: z.enum(["day", "week", "month"]),
  daysOfWeek: z.array(z.number().int().min(0).max(6)),
  endType: z.enum(["never", "count", "date"]),
  count: z.number().int().min(1).max(365),
  until: z.string().optional().default(""),
});

export const DUPLICATE_TICKET_NAME_MESSAGE =
  "Duplicate ticket name. Each ticket type must have a unique name.";

/**
 * Returns the indices of tickets whose (trimmed, lower-cased) name collides
 * with another ticket's name. Both the first occurrence and every later
 * duplicate are flagged so the user can resolve the conflict from either side.
 * Empty / whitespace-only names are ignored.
 */
export function findDuplicateTicketIndices(
  tickets: Array<{ name: string }>
): Set<number> {
  const firstSeen = new Map<string, number>();
  const duplicates = new Set<number>();
  tickets.forEach((t, i) => {
    const key = t.name.trim().toLowerCase();
    if (!key) return;
    if (firstSeen.has(key)) {
      duplicates.add(i);
      duplicates.add(firstSeen.get(key)!);
    } else {
      firstSeen.set(key, i);
    }
  });
  return duplicates;
}

export const createEventSchema = z
  .object({
    // Basic Information
    title: z.string().min(1, "Event title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    coverImage: z
      .custom<File | string | null>()
      .refine(
        (image) =>
          (typeof File !== "undefined" && image instanceof File) ||
          (typeof image === "string" && image.trim().length > 0),
        "Cover image is required",
      ),
    gallery: z.array(z.custom<File>()).optional(),

    // Date & Time
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),

    // Location
    eventType: z.enum(["physical", "online", "hybrid"]),
    category: z.enum(["music", "festival", "sports", "art", "theater", "comedy", "conference", "workshop"]),
    venueName: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    countryCode: z
      .string()
      .min(2, "Country code is required")
      .regex(/^[A-Za-z]{2}$/, "Country code must be a 2-letter ISO code"),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    capacity: z.number({ error: "Capacity must be a number" }).int().min(1, "Capacity must be at least 1"),
    eventClosingDate: z.string().optional(),
    streamingUrl: z.string().optional(),

    // Tickets
    tickets: z.array(ticketSchema).min(1, "At least one ticket type is required"),

    // Blockchain
    blockchainNetwork: z.enum(["ethereum", "polygon", "solana"]),
    treasuryAddress: z.string().min(1, "Treasury address is required"),
    creatorRoyalty: z.number().min(0).max(10),

    // Recurrence (optional — frequency=none means a single occurrence)
    recurrence: recurrenceSchema,
  })
  .superRefine((data, ctx) => {
    // End must be after start
    if (data.startDate && data.endDate && data.startTime && data.endTime) {
      const start = new Date(`${data.startDate}T${data.startTime}`);
      const end = new Date(`${data.endDate}T${data.endTime}`);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date/time must be after start date/time",
          path: ["endDate"],
        });
      }
    }

    if (data.eventClosingDate) {
      const start = data.startDate ? new Date(`${data.startDate}T${data.startTime || "00:00"}`) : null;
      const closing = new Date(`${data.eventClosingDate}T00:00`);
      if (start && !isNaN(start.getTime()) && !isNaN(closing.getTime()) && closing <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Closing date must be after the event start date",
          path: ["eventClosingDate"],
        });
      }
    }

    // Treasury address format validation per network
    if (data.treasuryAddress) {
      const addr = data.treasuryAddress.trim();
      const evmRe = /^0x[0-9a-fA-F]{40}$/;
      const solanaRe = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      const examples: Record<string, string> = {
        ethereum: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        polygon: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        solana: 'So11111111111111111111111111111111111111112',
      };
      const valid =
        (data.blockchainNetwork === 'solana' && solanaRe.test(addr)) ||
        (['ethereum', 'polygon'].includes(data.blockchainNetwork) && evmRe.test(addr));
      if (!valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid ${data.blockchainNetwork} address. Example: ${examples[data.blockchainNetwork]}`,
          path: ['treasuryAddress'],
        });
      }
    }
    if (data.eventType !== "online") {
      if (!data.venueName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Venue name is required for physical/hybrid events",
          path: ["venueName"],
        });
      }
      if (!data.address?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address is required for physical/hybrid events",
          path: ["address"],
        });
      }
      if (!data.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required for physical/hybrid events",
          path: ["city"],
        });
      }
    }

    // Recurrence cross-field checks (only when actually repeating)
    if (data.recurrence && data.recurrence.frequency !== "none") {
      const r = data.recurrence;
      if (r.endType === "date") {
        if (!r.until) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date is required when 'On date' is selected",
            path: ["recurrence", "until"],
          });
        } else if (data.startDate && r.until < data.startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurrence end date must be on or after the start date",
            path: ["recurrence", "until"],
          });
        }
      }
    }

    // Ticket names must be unique (case-insensitive). Empty/whitespace-only
    // names are skipped here — the per-ticket required-name rule handles those.
    const duplicateIndices = findDuplicateTicketIndices(data.tickets);
    duplicateIndices.forEach((i) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: DUPLICATE_TICKET_NAME_MESSAGE,
        path: ["tickets", i, "name"],
      });
    });
    // Streaming URL is required for online/hybrid events and must be a valid URL.
    if (data.eventType === "online" || data.eventType === "hybrid") {
      const url = data.streamingUrl?.trim() ?? "";
      if (!url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Streaming URL is required for online events",
          path: ["streamingUrl"],
        });
      } else {
        const parsed = z.string().url().safeParse(url);
        if (!parsed.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Streaming URL must be a valid URL (e.g. https://example.com)",
            path: ["streamingUrl"],
          });
        }
      }
    }
  });


export type CreateEventFormErrors = Partial<Record<string, string>>;

/** Maps Zod issues to a flat { fieldPath: message } record */
export function parseCreateEventErrors(
  issues: z.ZodIssue[]
): CreateEventFormErrors {
  const errors: CreateEventFormErrors = {};
  for (const issue of issues) {
    const key = issue.path.join(".");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Returns a human-readable section label for a field path */
export function sectionForField(field: string): string {
  if (["title", "description", "coverImage", "category"].includes(field)) return "Basic Information";
  if (field.startsWith("recurrence")) return "Recurrence";
  if (["startDate", "startTime", "endDate", "endTime", "eventClosingDate"].includes(field)) return "Date & Time";
  if (["venueName", "address", "city", "countryCode", "state", "zipCode", "capacity", "streamingUrl"].includes(field)) return "Location";
  if (field.startsWith("tickets")) return "Ticket Information";
  if (["blockchainNetwork", "treasuryAddress", "creatorRoyalty"].includes(field)) return "Blockchain Setting";
  return "General";
}

/** Returns the section id (data-section attribute) for a field */
export function sectionIdForField(field: string): string {
  if (["title", "description", "coverImage", "category"].includes(field)) return "section-basic";
  if (field.startsWith("recurrence")) return "section-recurrence";
  if (["startDate", "startTime", "endDate", "endTime", "eventClosingDate"].includes(field)) return "section-datetime";
  if (["venueName", "address", "city", "countryCode", "state", "zipCode", "capacity", "streamingUrl"].includes(field)) return "section-location";
  if (field.startsWith("tickets")) return "section-tickets";
  if (["blockchainNetwork", "treasuryAddress", "creatorRoyalty"].includes(field)) return "section-blockchain";
  return "";
}
