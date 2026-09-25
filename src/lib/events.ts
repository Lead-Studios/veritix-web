import type { EventStatus, Paginated, VeritixEvent } from '@/types';

/**
 * Read model for the events API.
 *
 * The catalogue below is a small in-memory fixture: this app has no database or
 * indexer wired up yet, and the API routes still need something to read from.
 * When the real source lands, `queryEvents` and `findEventBySlug` are the only
 * functions that have to change — the routes stay as they are.
 */

export const EVENT_SORTS = ['startsAt', '-startsAt', 'title', '-title'] as const;
export type EventSort = (typeof EVENT_SORTS)[number];
export const DEFAULT_EVENT_SORT: EventSort = 'startsAt';

export const EVENT_STATUSES: EventStatus[] = [
  'draft',
  'published',
  'cancelled',
  'completed',
];

export const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

export interface EventQuery {
  /** Free-text match against title, venue, and city. */
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: EventSort;
  city?: string;
  /** Exact match on the UTC calendar day of `startsAt`, as `YYYY-MM-DD`. */
  date?: string;
  status?: EventStatus;
  organizerId?: string;
}

export const EVENTS: VeritixEvent[] = [
  {
    id: 'evt_1',
    slug: 'lagos-sound-festival',
    title: 'Lagos Sound Festival',
    description: 'Two stages, twelve acts, and a headline set at sundown.',
    venue: 'Eko Convention Centre',
    city: 'Lagos',
    startsAt: '2026-10-17T16:00:00.000Z',
    endsAt: '2026-10-17T23:00:00.000Z',
    status: 'published',
    organizer: { id: 'org_1', name: 'Rhythm Nation', verified: true },
    tiers: [
      {
        id: 'tier_1a',
        name: 'Early bird',
        priceMinor: 5_000,
        currency: 'USD',
        quantityTotal: 400,
        quantitySold: 400,
      },
      {
        id: 'tier_1b',
        name: 'General admission',
        priceMinor: 8_500,
        currency: 'USD',
        quantityTotal: 900,
        quantitySold: 312,
      },
    ],
  },
  {
    id: 'evt_2',
    slug: 'nairobi-tech-summit',
    title: 'Nairobi Tech Summit',
    description: 'A single-track day on payments, identity, and open networks.',
    venue: 'KICC',
    city: 'Nairobi',
    startsAt: '2026-11-05T08:00:00.000Z',
    endsAt: '2026-11-05T17:00:00.000Z',
    status: 'published',
    organizer: { id: 'org_2', name: 'Savannah Labs', verified: true },
    tiers: [
      {
        id: 'tier_2a',
        name: 'Student',
        priceMinor: 2_000,
        currency: 'USD',
        quantityTotal: 150,
        quantitySold: 41,
      },
      {
        id: 'tier_2b',
        name: 'Professional',
        priceMinor: 12_000,
        currency: 'USD',
        quantityTotal: 500,
        quantitySold: 208,
      },
    ],
  },
  {
    id: 'evt_3',
    slug: 'accra-comedy-night',
    title: 'Accra Comedy Night',
    description: 'An intimate room and six sets, hosted monthly.',
    venue: 'Alliance Française',
    city: 'Accra',
    startsAt: '2026-10-17T19:30:00.000Z',
    endsAt: '2026-10-17T22:00:00.000Z',
    status: 'published',
    organizer: { id: 'org_3', name: 'Palm House', verified: false },
    tiers: [
      {
        id: 'tier_3a',
        name: 'Standard',
        priceMinor: 3_000,
        currency: 'USD',
        quantityTotal: 120,
        quantitySold: 76,
      },
    ],
  },
  {
    id: 'evt_4',
    slug: 'lagos-design-week',
    title: 'Lagos Design Week',
    description: 'Studios open their doors for a week of talks and exhibitions.',
    venue: 'Nike Art Gallery',
    city: 'Lagos',
    startsAt: '2026-12-02T09:00:00.000Z',
    endsAt: '2026-12-08T18:00:00.000Z',
    status: 'published',
    organizer: { id: 'org_1', name: 'Rhythm Nation', verified: true },
    tiers: [
      {
        id: 'tier_4a',
        name: 'Day pass',
        priceMinor: 4_500,
        currency: 'USD',
        quantityTotal: 300,
        quantitySold: 88,
      },
      {
        id: 'tier_4b',
        name: 'Week pass',
        priceMinor: 18_000,
        currency: 'USD',
        quantityTotal: 100,
        quantitySold: 24,
      },
    ],
  },
  {
    id: 'evt_5',
    slug: 'cape-town-trail-run',
    title: 'Cape Town Trail Run',
    description: 'A 21km coastal route with staggered starts.',
    venue: 'Table Mountain',
    city: 'Cape Town',
    startsAt: '2026-12-12T05:30:00.000Z',
    endsAt: '2026-12-12T12:00:00.000Z',
    status: 'published',
    organizer: { id: 'org_4', name: 'Coastal Athletics', verified: true },
    tiers: [
      {
        id: 'tier_5a',
        name: 'Half marathon',
        priceMinor: 6_000,
        currency: 'USD',
        quantityTotal: 250,
        quantitySold: 190,
      },
    ],
  },
  {
    id: 'evt_6',
    slug: 'kigali-jazz-nights',
    title: 'Kigali Jazz Nights',
    description: 'Late sets from a rotating house band and guests.',
    venue: 'Kigali Convention Centre',
    city: 'Kigali',
    startsAt: '2026-11-21T20:00:00.000Z',
    endsAt: '2026-11-21T23:30:00.000Z',
    status: 'draft',
    organizer: { id: 'org_3', name: 'Palm House', verified: false },
    tiers: [
      {
        id: 'tier_6a',
        name: 'Standard',
        priceMinor: 3_500,
        currency: 'USD',
        quantityTotal: 180,
        quantitySold: 0,
      },
    ],
  },
  {
    // The two completed shows below are what the analytics check-in rate is
    // measured against: sold against scanned only exists once an event has run.
    id: 'evt_7',
    slug: 'lagos-jazz-soul-night',
    title: 'Lagos Jazz & Soul Night',
    description: 'A hot August night of horns, grooves, and late sets.',
    venue: 'Freedom Park',
    city: 'Lagos',
    startsAt: '2026-09-11T19:00:00.000Z',
    endsAt: '2026-09-12T01:00:00.000Z',
    status: 'completed',
    organizer: { id: 'org_1', name: 'Rhythm Nation', verified: true },
    tiers: [
      {
        id: 'tier_7a',
        name: 'Balcony',
        priceMinor: 4_000,
        currency: 'USD',
        quantityTotal: 150,
        quantitySold: 96,
      },
      {
        id: 'tier_7b',
        name: 'Floor',
        priceMinor: 7_500,
        currency: 'USD',
        quantityTotal: 350,
        quantitySold: 218,
      },
    ],
  },
  {
    id: 'evt_8',
    slug: 'accra-chill-fest',
    title: 'Accra Chill Fest',
    description: 'An outdoor afternoon of highlife, afrobeat, and sound systems.',
    venue: 'Labadi Beach',
    city: 'Accra',
    startsAt: '2026-08-29T14:00:00.000Z',
    endsAt: '2026-08-29T22:00:00.000Z',
    status: 'completed',
    organizer: { id: 'org_1', name: 'Rhythm Nation', verified: true },
    tiers: [
      {
        id: 'tier_8a',
        name: 'General admission',
        priceMinor: 5_500,
        currency: 'USD',
        quantityTotal: 500,
        quantitySold: 431,
      },
    ],
  },
];

/** Compare two events for the requested sort. List order is never mutated. */
function compareEvents(a: VeritixEvent, b: VeritixEvent, sort: EventSort): number {
  switch (sort) {
    case 'title':
      return a.title.localeCompare(b.title);
    case '-title':
      return b.title.localeCompare(a.title);
    case '-startsAt':
      return b.startsAt.localeCompare(a.startsAt);
    case 'startsAt':
    default:
      return a.startsAt.localeCompare(b.startsAt);
  }
}

function toPositiveInt(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  const truncated = Math.trunc(value);
  return truncated > 0 ? truncated : fallback;
}

/** Apply the list filters and paginate, returning the standard envelope. */
export function queryEvents(query: EventQuery = {}): Paginated<VeritixEvent> {
  const page = toPositiveInt(query.page, 1);
  const requestedSize = toPositiveInt(query.pageSize, DEFAULT_PAGE_SIZE);
  const pageSize = Math.min(requestedSize, MAX_PAGE_SIZE);

  const q = query.q?.trim().toLowerCase();
  const city = query.city?.trim().toLowerCase();
  const date = query.date?.trim();
  const organizerId = query.organizerId?.trim();

  const matched = EVENTS.filter((event) => {
    if (city && event.city.toLowerCase() !== city) return false;
    if (date && event.startsAt.slice(0, 10) !== date) return false;
    if (query.status && event.status !== query.status) return false;
    if (organizerId && event.organizer.id !== organizerId) return false;
    if (q) {
      const haystack = `${event.title} ${event.venue} ${event.city}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => compareEvents(a, b, query.sort ?? DEFAULT_EVENT_SORT));

  const start = (page - 1) * pageSize;

  return {
    items: matched.slice(start, start + pageSize),
    page,
    pageSize,
    total: matched.length,
  };
}

export function findEventBySlug(slug: string): VeritixEvent | undefined {
  return EVENTS.find((event) => event.slug === slug);
}
