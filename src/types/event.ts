export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "POSTPONED" | "COMPLETED";
export type EventCategory =
  | "music" | "festival" | "sports" | "art"
  | "theater" | "comedy" | "conference" | "workshop";

export interface EventTicketOption {
  name: string;
  description: string;
  benefits: string[];
  price: number;
  remaining: number;
  popular?: boolean;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  eventClosingDate?: string;
  date?: string;
  dateEnd?: string;
  time?: string;
  location: string;
  venue: string;
  city?: string;
  countryCode?: string;
  category: EventCategory;
  status: EventStatus;
  capacity?: number;
  isVirtual?: boolean;
  streamingUrl?: string;
  imageUrl?: string;
  image?: string;
  organizerId: string;
  organizer?: { name: string; verified: boolean; description?: string };
  price: string;
  priceInEth?: number;
  featured?: boolean;
  attendees?: number;
  schedule?: { time: string; title: string; description: string }[];
  performers?: { name: string; role?: string; image?: string }[];
  ticketOptions?: EventTicketOption[];
}
