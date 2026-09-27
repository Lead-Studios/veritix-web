/**
 * Core domain types shared across the app.
 *
 * On-chain amounts are `bigint` (stroops). Fiat amounts are integer minor
 * units (cents) as `number` — never a float, so display rounding is explicit.
 */

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type TicketStatus = 'valid' | 'used' | 'refunded' | 'transferred';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Organizer {
  id: string;
  name: string;
  avatarUrl?: string;
  verified: boolean;
}

export interface TicketTier {
  id: string;
  name: string;
  /** Price in integer minor units. */
  priceMinor: number;
  currency: string;
  quantityTotal: number;
  quantitySold: number;
}

/** A share of an event's ticket revenue paid to someone other than the organizer. */
export interface RevenueSplit {
  recipient: string;
  percent: number;
}

export interface VeritixEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  /** Extra gallery images in display order; falls back to the cover image. */
  images?: string[];
  venue: string;
  /** Street address for the venue, when the organizer supplied one. */
  address?: string;
  city: string;
  startsAt: string;
  endsAt: string;
  status: EventStatus;
  organizer: Organizer;
  tiers: TicketTier[];
  /** Empty or absent means the organizer keeps all of the revenue. */
  splits?: RevenueSplit[];
}

export interface Ticket {
  id: string;
  eventId: string;
  tierId: string;
  ownerId: string;
  status: TicketStatus;
  /** On-chain escrow id backing this ticket, when settled through the contract. */
  escrowId?: string;
  issuedAt: string;
}

export interface Order {
  id: string;
  eventId: string;
  buyerId: string;
  status: OrderStatus;
  totalMinor: number;
  currency: string;
  createdAt: string;
  tickets: Ticket[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  walletAddress?: string;
}

/** Standard envelope for a paginated list response. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
