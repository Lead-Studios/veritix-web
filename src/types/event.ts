export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "POSTPONED" | "COMPLETED";
export type EventCategory =
  | "music" | "festival" | "sports" | "art"
  | "theater" | "comedy" | "conference" | "workshop";

export interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  eventClosingDate?: string;
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
  organizerId: string;
  organizer?: { name: string; verified: boolean; description?: string };
  price: string;
  featured?: boolean;
  attendees?: number;
  schedule?: { time: string; title: string; description: string }[];
  performers?: { name: string; role?: string }[];
}
