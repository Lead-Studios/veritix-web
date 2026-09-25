import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RANGE_DAYS,
  MAX_RANGE_DAYS,
  queryAnalytics,
  queryCheckInRates,
  resolveAnalyticsRange,
} from '@/lib/analytics';

const NOW = new Date('2026-09-25T12:00:00.000Z');
/** Owns evt_1, evt_4, evt_7 (completed), and evt_8 (completed). */
const OWNER = 'user_rhythm';
/** Owns evt_2 only, so it shares no events with OWNER. */
const OTHER_OWNER = 'user_savannah';

describe('resolveAnalyticsRange', () => {
  it('defaults to the last DEFAULT_RANGE_DAYS days, ending today', () => {
    expect(resolveAnalyticsRange(undefined, undefined, NOW)).toEqual({
      from: '2026-08-27',
      to: '2026-09-25',
    });
    const { from, to } = resolveAnalyticsRange(undefined, undefined, NOW);
    expect((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000).toBe(
      DEFAULT_RANGE_DAYS - 1,
    );
  });

  it('keeps an explicit range', () => {
    expect(resolveAnalyticsRange('2026-08-01', '2026-08-31', NOW)).toEqual({
      from: '2026-08-01',
      to: '2026-08-31',
    });
  });

  it('swaps a reversed range instead of rejecting it', () => {
    expect(resolveAnalyticsRange('2026-08-31', '2026-08-01', NOW)).toEqual({
      from: '2026-08-01',
      to: '2026-08-31',
    });
  });

  it('falls back to the default window for unparseable or impossible days', () => {
    expect(resolveAnalyticsRange('not-a-day', '2026-09-25', NOW)).toEqual({
      from: '2026-08-27',
      to: '2026-09-25',
    });
    expect(resolveAnalyticsRange('2026-02-30', '2026-09-25', NOW)).toEqual({
      from: '2026-08-27',
      to: '2026-09-25',
    });
  });

  it('keeps a valid bound when only the other one is unparseable', () => {
    expect(resolveAnalyticsRange('2026-08-01', '', NOW)).toEqual({
      from: '2026-08-01',
      to: '2026-09-25',
    });
    expect(resolveAnalyticsRange('', '2026-09-10', NOW)).toEqual({
      from: '2026-08-27',
      to: '2026-09-10',
    });
  });

  it('clamps a range wider than MAX_RANGE_DAYS, keeping the end date', () => {
    const range = resolveAnalyticsRange('2000-01-01', '2026-09-25', NOW);
    const days =
      (Date.parse(`${range.to}T00:00:00Z`) - Date.parse(`${range.from}T00:00:00Z`)) / 86_400_000;
    expect(days).toBe(MAX_RANGE_DAYS - 1);
    expect(range.to).toBe('2026-09-25');
  });
});

describe('queryAnalytics', () => {
  it('only ever reports events the caller owns', () => {
    const mine = queryAnalytics({ ownerId: OWNER });
    const theirs = queryAnalytics({ ownerId: OTHER_OWNER });

    expect(mine.totals.eventCount).toBeGreaterThan(0);
    expect(theirs.totals.eventCount).toBe(1);
    // evt_2 belongs to the other account, so it cannot appear in the wider view.
    expect(mine.totals.ticketsSold).not.toBe(theirs.totals.ticketsSold);
  });

  it('returns an empty snapshot for an event the caller does not own', () => {
    const snapshot = queryAnalytics({ ownerId: OWNER, eventId: 'evt_2' });
    expect(snapshot.totals.ticketsSold).toBe(0);
    expect(snapshot.totals.eventCount).toBe(0);
    expect(snapshot.salesOverTime).toEqual([]);
    expect(snapshot.totals.checkInRate).toBeNull();
  });

  it('sums one event in isolation', () => {
    const all = queryAnalytics({ ownerId: OWNER });
    const one = queryAnalytics({ ownerId: OWNER, eventId: 'evt_1' });
    expect(one.totals.ticketsSold).toBeGreaterThan(0);
    expect(one.totals.ticketsSold).toBeLessThan(all.totals.ticketsSold);
    expect(one.eventId).toBe('evt_1');
  });

  it('clamps the series to the range and orders it by date', () => {
    const range = { from: '2026-09-10', to: '2026-09-15' };
    const snapshot = queryAnalytics({ ownerId: OWNER, ...range });
    const dates = snapshot.salesOverTime.map((point) => point.date);

    expect(dates.length).toBeGreaterThan(0);
    expect(dates).toEqual([...dates].sort());
    expect(dates[0] >= range.from).toBe(true);
    expect(dates.at(-1)! <= range.to).toBe(true);
  });

  it('leaves the check-in rate undefined when nothing was sold', () => {
    const empty = queryAnalytics({ ownerId: OWNER, from: '2026-01-01', to: '2026-01-02' });
    expect(empty.totals.ticketsSold).toBe(0);
    expect(empty.totals.checkInRate).toBeNull();
  });
});

describe('queryCheckInRates', () => {
  it('reports checked-in against sold for events that have run', () => {
    const report = queryCheckInRates({ ownerId: OWNER });
    const completed = report.events.filter((event) => event.checkedIn > 0);

    expect(completed.length).toBeGreaterThanOrEqual(2);
    for (const event of completed) {
      expect(event.checkedIn).toBeLessThanOrEqual(event.ticketsSold);
      expect(event.rate).toBeCloseTo(event.checkedIn / event.ticketsSold, 10);
      // The rate is a proportion, not a percentage.
      expect(event.rate!).toBeLessThanOrEqual(1);
    }
  });

  it('gives an event that has not happened yet a rate of zero', () => {
    const report = queryCheckInRates({ ownerId: OWNER });
    const upcoming = report.events.find((event) => event.eventId === 'evt_1');
    expect(upcoming).toBeDefined();
    expect(upcoming!.checkedIn).toBe(0);
    expect(upcoming!.rate).toBe(0);
  });

  it('keeps a lifetime rate when the range covers sales but not the event day', () => {
    // evt_7 ran on 2026-09-11 and sold from 2026-08-21. A window that catches
    // the sales but not the doors must not report a confident 0%.
    const report = queryCheckInRates({ ownerId: OWNER, from: '2026-08-22', to: '2026-08-31' });
    const event = report.events.find((candidate) => candidate.eventId === 'evt_7');

    expect(event).toBeDefined();
    expect(event!.checkedIn).toBeGreaterThan(0);
    expect(event!.rate).toBeGreaterThan(0);
  });

  it('orders the trend oldest first so it can be plotted directly', () => {
    const { trend } = queryCheckInRates({ ownerId: OWNER });
    expect(trend.length).toBeGreaterThanOrEqual(2);
    expect(trend.map((point) => point.startsAt)).toEqual(
      trend.map((point) => point.startsAt).sort(),
    );
  });

  it('excludes an event with no activity in the range rather than reporting 0%', () => {
    const report = queryCheckInRates({ ownerId: OWNER, from: '2026-01-01', to: '2026-01-02' });
    expect(report.events).toEqual([]);
    expect(report.trend).toEqual([]);
  });

  it('is scoped to the owner', () => {
    const report = queryCheckInRates({ ownerId: OTHER_OWNER, eventId: 'evt_7' });
    expect(report.events).toEqual([]);
    expect(report.trend).toEqual([]);
  });
});
