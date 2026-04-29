import { z } from "zod";

const ticketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  quantity: z.number({ invalid_type_error: "Quantity must be a number" }).int().min(1, "Quantity must be at least 1"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, "Price must be a valid non-negative number"),
  description: z.string().optional(),
  transferable: z.boolean(),
  resellable: z.boolean(),
  resellPriceLimit: z.string().optional(),
});

export const createEventSchema = z
  .object({
    // Basic Information
    title: z.string().min(1, "Event title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    coverImage: z
      .custom<File | null>()
      .refine((f) => f instanceof File, "Cover image is required"),
    gallery: z.array(z.custom<File>()).optional(),

    // Date & Time
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),

    // Location
    eventType: z.enum(["physical", "online", "hybrid"]),
    venueName: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),

    // Tickets
    tickets: z.array(ticketSchema).min(1, "At least one ticket type is required"),

    // Blockchain
    blockchainNetwork: z.enum(["ethereum", "polygon", "solana"]),
    treasuryAddress: z.string().min(1, "Treasury address is required"),
    creatorRoyalty: z.number().min(0).max(10),
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

    // Physical/hybrid events need a venue
    if (data.eventType !== "online") {
      if (!data.venueName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Venue name is required for physical/hybrid events",
          path: ["venueName"],
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
  if (["title", "description", "coverImage"].includes(field)) return "Basic Information";
  if (["startDate", "startTime", "endDate", "endTime"].includes(field)) return "Date & Time";
  if (["venueName", "address", "city", "state", "zipCode"].includes(field)) return "Location";
  if (field.startsWith("tickets")) return "Ticket Information";
  if (["blockchainNetwork", "treasuryAddress", "creatorRoyalty"].includes(field)) return "Blockchain Setting";
  return "General";
}

/** Returns the section id (data-section attribute) for a field */
export function sectionIdForField(field: string): string {
  if (["title", "description", "coverImage"].includes(field)) return "section-basic";
  if (["startDate", "startTime", "endDate", "endTime"].includes(field)) return "section-datetime";
  if (["venueName", "address", "city", "state", "zipCode"].includes(field)) return "section-location";
  if (field.startsWith("tickets")) return "section-tickets";
  if (["blockchainNetwork", "treasuryAddress", "creatorRoyalty"].includes(field)) return "section-blockchain";
  return "";
}
