'use client';

import * as React from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExportButton } from '@/components/analytics/export-button';
import { formatDate, formatNumber } from '@/lib/format';
import type { AnalyticsRange, CheckInRateReport, SalesPoint } from '@/lib/analytics';

/**
 * Checked-in against sold.
 *
 * Sold tickets and attended tickets are different numbers, and the gap is the
 * thing an organizer actually wants: it is wasted inventory on one side and
 * disappointed buyers on the other. This shows the rate per event and the trend
 * across the organizer's past events, so a single bad night can be read against
 * a history rather than in isolation.
 *
 * The rate is the event's own lifetime figure, not a slice of the active range —
 * check-ins all land on the day the doors open, so a range that caught the sales
 * but not the event would otherwise report a confident 0% for a full house. The
 * range selects which events are in view; it is never the denominator.
 */

export interface CheckInRateProps {
  /** Active date range. Omit to let the API use its own default window. */
  range?: Partial<AnalyticsRange>;
  /** Restrict the view to one event. */
  eventId?: string;
  eventTitle?: string;
  /** Rendered alongside the metric so the export always matches what is shown. */
  salesOverTime?: SalesPoint[];
  currency?: string;
  className?: string;
}

const SUMMARY_PATH = '/analytics';
const RATE_PATH = '/analytics/check-in-rate';

/** `analytics?from=…&to=…&eventId=…`, with the empty parameters dropped. */
function buildRequest(path: string, range: Partial<AnalyticsRange>, eventId?: string): string {
  const params = new URLSearchParams();
  if (range.from) params.set('from', range.from);
  if (range.to) params.set('to', range.to);
  if (eventId) params.set('eventId', eventId);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/** 0.621 → "62.1%" */
function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

/**
 * Rate per event as a row of bars, with the trend as a compact sparkline.
 *
 * Deliberately plain SVG rather than `recharts`: this is the one analytics
 * widget that must render in the dashboard's first paint, and importing the
 * chart library here would undo the lazy loading in `SalesChart`.
 */
function RateTrend({ trend }: { trend: CheckInRateReport['trend'] }) {
  if (trend.length === 0) return null;

  const width = 240;
  const height = 56;
  const gap = 8;
  const barWidth = Math.max(4, (width - gap * (trend.length - 1)) / trend.length);

  return (
    <svg
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      className="h-14 w-full text-primary"
      preserveAspectRatio="none"
    >
      <title>Check-in rate across {trend.length} events</title>
      {trend.map((point, index) => {
        // A 100% rate must not fill the whole box or the top row is clipped.
        const ratio = point.rate ?? 0;
        const barHeight = Math.max(2, ratio * (height - 4));

        return (
          <rect
            key={point.eventId}
            x={index * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill="currentColor"
            opacity={0.35 + 0.65 * ratio}
          >
            <title>{`${point.title}: ${formatRate(ratio)}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

export function CheckInRate({
  range = {},
  eventId,
  eventTitle,
  salesOverTime = [],
  currency = 'USD',
  className,
}: CheckInRateProps) {
  const rateKey = buildRequest(RATE_PATH, range, eventId);
  const summaryKey = buildRequest(SUMMARY_PATH, range, eventId);

  const { data, error, isLoading } = useSWR<CheckInRateReport>(rateKey);
  // Only needed to put the sales series in the export; a failure here should not
  // take the metric down with it.
  const { data: summary } = useSWR<{ range: AnalyticsRange }>(summaryKey);

  const events = data?.events ?? [];
  const trend = data?.trend ?? [];
  const activeRange = data?.range ?? summary?.range;

  if (isLoading) {
    return (
      <div className={className} data-testid="check-in-rate-loading">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-4 h-14 w-full" />
        <Skeleton className="mt-4 h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Check-in rate</CardTitle>
          <CardDescription>Could not load this metric. Try again in a moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Check-in rate</CardTitle>
          <CardDescription>
            {activeRange
              ? `Checked-in against sold, ${activeRange.from} to ${activeRange.to}.`
              : 'Checked-in against sold.'}
          </CardDescription>
        </div>
        {activeRange && (
          <ExportButton
            range={activeRange}
            salesOverTime={salesOverTime}
            checkInRates={events}
            currency={currency}
            eventTitle={eventTitle}
          />
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No events sold a ticket in this range, so there is no rate to report.
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {events.map((event) => (
                <li key={event.eventId} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="truncate text-sm font-medium">{event.title}</span>
                    <span className="shrink-0 text-sm tabular-nums">
                      {event.rate === null ? '—' : formatRate(event.rate)}
                    </span>
                  </div>
                  {/* role="img" so the bar is read as a value, not as decoration. */}
                  <div
                    role="img"
                    aria-label={`${event.title}: ${formatNumber(event.checkedIn)} of ${formatNumber(
                      event.ticketsSold,
                    )} tickets checked in`}
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((event.rate ?? 0) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(event.checkedIn)} of {formatNumber(event.ticketsSold)} checked in ·{' '}
                    {formatDate(event.startsAt)}
                  </p>
                </li>
              ))}
            </ul>

            {trend.length > 1 && (
              <section aria-label="Check-in rate trend" className="space-y-2">
                <h3 className="text-sm font-medium">Trend across past events</h3>
                <RateTrend trend={trend} />
                <p className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatDate(trend[0].startsAt)}</span>
                  <span>{formatDate(trend[trend.length - 1].startsAt)}</span>
                </p>
              </section>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
