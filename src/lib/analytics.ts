import { EVENTS } from '@/lib/events';

/**
 * Read model for the organizer analytics API.
 *
 * Same caveat as `@/lib/events`: this app has no database or indexer wired up
 * yet, so the numbers below are a generated fixture. `queryAnalytics` and
 * `queryCheckInRates` are the only functions that have to change when the real
 * source lands — the routes and the components stay as they are.
 *
 * Every query requires an `ownerId`, and the fixture is filtered by it before
 * anything is aggregated. Scoping at the read model rather than in the route
 * means a caller cannot ask for a number that is not theirs to see.
 */

const DAY_MS = 86_400_000;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Length of the range used when the request does not name one. */
export const DEFAULT_RANGE_DAYS = 30;
/** Upper bound on a range, so a stray parameter cannot ask for the whole catalogue. */
export const MAX_RANGE_DAYS = 366;

/**
 * The day the fixture is "run up to". Pinned rather than read from the clock so
 * the generated sales history is identical on the server and in the browser and
 * across deploys — otherwise the same request would return different numbers.
 */
const FIXTURE_TODAY = '2026-09-25';

/** Inclusive `YYYY-MM-DD` bounds. */
export interface AnalyticsRange {
  from: string;
  to: string;
}

export interface AnalyticsTotals {
  ticketsSold: number;
  checkedIn: number;
  /** Integer minor units, summed across currencies as if they were one. */
  grossMinor: number;
  /** 0–1, or `null` when nothing was sold and the ratio is undefined. */
  checkInRate: number | null;
  eventCount: number;
}

export interface SalesPoint {
  date: string;
  ticketsSold: number;
  grossMinor: number;
}

export interface AnalyticsSnapshot {
  range: AnalyticsRange;
  /** The event filter, or `null` when the view spans every owned event. */
  eventId: string | null;
  totals: AnalyticsTotals;
  salesOverTime: SalesPoint[];
  currency: string;
}

export interface CheckInRateRow {
  eventId: string;
  title: string;
  startsAt: string;
  ticketsSold: number;
  checkedIn: number;
  /** 0–1, or `null` when nothing was sold in the range. */
  rate: number | null;
}

export interface CheckInRateReport {
  range: AnalyticsRange;
  eventId: string | null;
  events: CheckInRateRow[];
  /**
   * The same rates ordered by event date, oldest first, for the trend line.
   * Events with no sold tickets are left out — they have no rate to plot.
   */
  trend: Array<Pick<CheckInRateRow, 'eventId' | 'title' | 'startsAt' | 'rate'>>;
}

export interface AnalyticsQuery extends Partial<AnalyticsRange> {
  eventId?: string;
  ownerId: string;
}

/** Days of sales history generated for each event. */
const SALES_WINDOW_DAYS = 21;

/** Which account owns each event, standing in for the platform's organizer table. */
const OWNER_BY_EVENT: Record<string, string> = {
  evt_1: 'user_rhythm',
  evt_2: 'user_savannah',
  evt_3: 'user_palm',
  evt_4: 'user_rhythm',
  evt_5: 'user_coastal',
  evt_6: 'user_palm',
  evt_7: 'user_rhythm',
  evt_8: 'user_rhythm',
};

/**
 * Share of sold tickets that turned up, per completed event. A low rate is a
 * real signal to an organizer, so the fixture is not uniformly flattering.
 */
const ATTENDANCE: Record<string, number> = {
  evt_7: 0.62,
  evt_8: 0.88,
};

interface DailyRow {
  date: string;
  eventId: string;
  ownerId: string;
  ticketsSold: number;
  checkedIn: number;
  grossMinor: number;
}

/** Whole days since the epoch for a `YYYY-MM-DD`, or `null` if it is not a real day. */
function toDayNumber(day: string): number | null {
  if (!ISO_DAY.test(day)) return null;
  const ms = Date.parse(`${day}T00:00:00.000Z`);
  if (Number.isNaN(ms)) return null;
  // Date.parse rolls 2026-02-30 over into March rather than failing, so compare.
  if (new Date(ms).toISOString().slice(0, 10) !== day) return null;
  return ms / DAY_MS;
}

function toDayLabel(dayNumber: number): string {
  return new Date(dayNumber * DAY_MS).toISOString().slice(0, 10);
}

/** Midnight UTC today, as a day number. */
function todayDayNumber(now: Date): number {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / DAY_MS;
}

/**
 * Turn `from`/`to` query parameters into a usable range.
 *
 * Unparseable or missing bounds fall back to the last `DEFAULT_RANGE_DAYS` days,
 * and a reversed range is swapped rather than rejected — both are bookmarks or
 * typos, and either should still render a sensible view instead of an error.
 * The span is then clamped to `MAX_RANGE_DAYS`.
 */
export function resolveAnalyticsRange(
  from?: string,
  to?: string,
  now: Date = new Date(),
): AnalyticsRange {
  const today = todayDayNumber(now);
  const fallbackFrom = today - (DEFAULT_RANGE_DAYS - 1);

  const requestedFrom = toDayNumber(from?.trim() ?? '');
  const requestedTo = toDayNumber(to?.trim() ?? '');

  let start = requestedFrom ?? fallbackFrom;
  let end = requestedTo ?? today;

  if (start > end) [start, end] = [end, start];
  if (end - start + 1 > MAX_RANGE_DAYS) start = end - (MAX_RANGE_DAYS - 1);

  return { from: toDayLabel(start), to: toDayLabel(end) };
}

/**
 * Small deterministic PRNG. The fixture must not depend on `Math.random`, or the
 * server and the client would render different numbers for the same range.
 */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable 32-bit hash, so each event's series is seeded by its own id. */
function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Revenue-weighted average ticket price, in minor units, for an event. */
function averageTicketPriceMinor(event: (typeof EVENTS)[number]): number {
  const sold = event.tiers.reduce((total, tier) => total + tier.quantitySold, 0);
  if (sold === 0) return event.tiers[0]?.priceMinor ?? 0;
  const revenue = event.tiers.reduce(
    (total, tier) => total + tier.priceMinor * tier.quantitySold,
    0,
  );
  return Math.round(revenue / sold);
}

/**
 * Build one event's sales history, normalised so the window total matches the
 * event's own `quantitySold`. Sales taper towards the event date, and each day
 * carries a little noise so the chart is not a straight line.
 */
function buildEventRows(event: (typeof EVENTS)[number], ownerId: string): DailyRow[] {
  const startsAtDay = toDayNumber(event.startsAt.slice(0, 10));
  if (startsAtDay === null) return [];

  const fixtureToday = toDayNumber(FIXTURE_TODAY) as number;
  const endDay = Math.min(startsAtDay - 1, fixtureToday);
  const startDay = endDay - (SALES_WINDOW_DAYS - 1);

  const totalSold = event.tiers.reduce((total, tier) => total + tier.quantitySold, 0);
  if (totalSold === 0) return [];

  const random = seededRandom(hash(event.id));
  const priceMinor = averageTicketPriceMinor(event);

  const weights = Array.from({ length: SALES_WINDOW_DAYS }, (_, index) => {
    // Ramp towards the event: weight grows with days-to-go, plus 40% noise.
    const daysToGo = SALES_WINDOW_DAYS - index;
    return 0.35 + daysToGo / SALES_WINDOW_DAYS + random() * 0.4;
  });
  const weightTotal = weights.reduce((total, weight) => total + weight, 0);

  // Largest-remainder apportionment, so the day totals sum to totalSold exactly.
  const raw = weights.map((weight) => (weight / weightTotal) * totalSold);
  const allocated = raw.map((value) => Math.floor(value));
  let remainder = totalSold - allocated.reduce((total, value) => total + value, 0);
  for (
    let index = raw.indexOf(Math.max(...raw));
    remainder > 0;
    index = (index + 1) % allocated.length
  ) {
    allocated[index] += 1;
    remainder -= 1;
  }

  const hasRun = event.status === 'completed' && startsAtDay <= fixtureToday;
  const attendance = ATTENDANCE[event.id];

  const rows = allocated.map((ticketsSold, index) => {
    const date = toDayLabel(startDay + index);
    return {
      date,
      eventId: event.id,
      ownerId,
      ticketsSold,
      // Check-ins only ever happen on the day the doors open, so they are added
      // as their own row below rather than spread across the sales window.
      checkedIn: 0,
      grossMinor: ticketsSold * priceMinor,
    } satisfies DailyRow;
  });

  if (hasRun) {
    // Attendance applies to everything the event sold, not to the final day's
    // sales, so the figure is taken against the event's own total.
    rows.push({
      date: event.startsAt.slice(0, 10),
      eventId: event.id,
      ownerId,
      ticketsSold: 0,
      checkedIn: Math.round(totalSold * (attendance ?? 0)),
      grossMinor: 0,
    });
  }

  return rows;
}

const DAILY_ROWS: DailyRow[] = EVENTS.flatMap((event) => {
  const ownerId = OWNER_BY_EVENT[event.id];
  return ownerId ? buildEventRows(event, ownerId) : [];
});

/** Events the account may see, in event-date order. */
function ownedEvents(ownerId: string, eventId?: string) {
  return EVENTS.filter((event) => OWNER_BY_EVENT[event.id] === ownerId)
    .filter((event) => !eventId || event.id === eventId)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

function aggregate(rows: DailyRow[], eventCount: number): Pick<AnalyticsSnapshot, 'totals' | 'salesOverTime'> {
  const byDate = new Map<string, SalesPoint>();

  for (const row of rows) {
    const point = byDate.get(row.date) ?? { date: row.date, ticketsSold: 0, grossMinor: 0 };
    point.ticketsSold += row.ticketsSold;
    point.grossMinor += row.grossMinor;
    byDate.set(row.date, point);
  }

  const salesOverTime = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  const ticketsSold = rows.reduce((total, row) => total + row.ticketsSold, 0);
  const checkedIn = rows.reduce((total, row) => total + row.checkedIn, 0);
  const grossMinor = rows.reduce((total, row) => total + row.grossMinor, 0);

  return {
    totals: {
      ticketsSold,
      checkedIn,
      grossMinor,
      // Undefined rather than zero: nothing sold is not "nobody turned up".
      checkInRate: ticketsSold > 0 ? checkedIn / ticketsSold : null,
      eventCount,
    },
    salesOverTime,
  };
}

function currencyFor(events: (typeof EVENTS)[number][]): string {
  // The app settles in one currency today; the first event decides for the view.
  return events[0]?.tiers[0]?.currency ?? 'USD';
}

/**
 * Summary totals plus a daily sales series for the requested range.
 *
 * An `eventId` that is not owned by the caller yields an empty snapshot rather
 * than a 404, so the filter cannot be used to probe for events that exist.
 */
export function queryAnalytics(query: AnalyticsQuery): AnalyticsSnapshot {
  const range = resolveAnalyticsRange(query.from, query.to);
  const eventId = query.eventId?.trim() || undefined;

  const events = ownedEvents(query.ownerId, eventId);
  const from = toDayNumber(range.from) as number;
  const to = toDayNumber(range.to) as number;

  const rows = DAILY_ROWS.filter((row) => {
    if (row.ownerId !== query.ownerId) return false;
    if (eventId && row.eventId !== eventId) return false;
    const day = toDayNumber(row.date) as number;
    return day >= from && day <= to;
  });

  const { totals, salesOverTime } = aggregate(rows, events.length);

  return { range, eventId: eventId ?? null, totals, salesOverTime, currency: currencyFor(events) };
}

/**
 * Checked-in against sold, per event, for the requested range.
 *
 * The range decides *which* events are in view — an event is included when it
 * ran, or sold a ticket, inside the window. It deliberately does not clip the
 * rate itself: check-ins all land on the day the doors open, so a window that
 * caught the sales but not the event day would report a confident 0% for an
 * event that was actually full. Every rate here is therefore the event's own
 * lifetime figure, and the range is a filter, never a denominator.
 *
 * An event with no sold tickets is left out entirely: nothing sold is not the
 * same as nobody turned up, and it has no rate to plot.
 */
export function queryCheckInRates(query: AnalyticsQuery): CheckInRateReport {
  const range = resolveAnalyticsRange(query.from, query.to);
  const eventId = query.eventId?.trim() || undefined;

  const from = toDayNumber(range.from) as number;
  const to = toDayNumber(range.to) as number;
  const inRange = (day: string) => {
    const dayNumber = toDayNumber(day);
    return dayNumber !== null && dayNumber >= from && dayNumber <= to;
  };

  const events = ownedEvents(query.ownerId, eventId)
    .filter((event) => {
      if (inRange(event.startsAt.slice(0, 10))) return true;
      return DAILY_ROWS.some(
        (row) => row.eventId === event.id && row.ownerId === query.ownerId && inRange(row.date),
      );
    })
    .map((event) => {
      const rows = DAILY_ROWS.filter(
        (row) => row.ownerId === query.ownerId && row.eventId === event.id,
      );
      const ticketsSold = rows.reduce((total, row) => total + row.ticketsSold, 0);
      const checkedIn = rows.reduce((total, row) => total + row.checkedIn, 0);

      return {
        eventId: event.id,
        title: event.title,
        startsAt: event.startsAt,
        ticketsSold,
        checkedIn,
        rate: ticketsSold > 0 ? checkedIn / ticketsSold : null,
      } satisfies CheckInRateRow;
    })
    .filter((event) => event.rate !== null);

  return {
    range,
    eventId: eventId ?? null,
    events,
    trend: events.map(({ eventId: id, title, startsAt, rate }) => ({
      eventId: id,
      title,
      startsAt,
      rate,
    })),
  };
}
