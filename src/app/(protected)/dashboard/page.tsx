'use client';

import * as React from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckInRate } from '@/components/analytics/check-in-rate';
import { SALES_CHART_HEIGHT, SalesChart } from '@/components/analytics/sales-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency, formatNumber } from '@/lib/format';
import type { AnalyticsSnapshot } from '@/lib/analytics';

/**
 * Organizer overview.
 *
 * Everything here comes from `/api/analytics`, which scopes the response to the
 * session user's own events. The chart is the one lazy-loaded widget on the
 * page, so the dashboard's first paint does not carry `recharts` — see
 * `components/analytics/sales-chart`.
 */
export default function DashboardOverviewPage() {
  const { data, error, isLoading } = useSWR<AnalyticsSnapshot>('/analytics');

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
  // The page had no heading, so a screen reader landing on the dashboard found
  // four unlabelled values and nothing to orient by.
  const heading = <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>;

  if (loading) {
    return (
      <div>
        {heading}
        {/* role="status" so the loading state is announced rather than being
            a silent block of grey rectangles. */}
        <p role="status" className="sr-only">
          Loading your dashboard
        </p>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            We could not load your numbers. Check your connection and try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { totals, salesOverTime, currency } = data ?? {
    totals: {
      ticketsSold: 0,
      checkedIn: 0,
      grossMinor: 0,
      checkInRate: null,
      eventCount: 0,
    },
    salesOverTime: [],
    currency: 'USD',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Events" value={totals.eventCount} />
        <StatCard label="Tickets sold" value={formatNumber(totals.ticketsSold)} />
        <StatCard label="Gross revenue" value={formatCurrency(totals.grossMinor, currency)} />
        <StatCard
          label="Check-in rate"
          value={totals.checkInRate === null ? '—' : `${(totals.checkInRate * 100).toFixed(1)}%`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales over time</CardTitle>
          <CardDescription>Tickets sold and gross revenue per day.</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart
            points={salesOverTime}
            currency={currency}
            height={SALES_CHART_HEIGHT}
          />
        </CardContent>
      </Card>

      <CheckInRate
        range={data?.range}
        salesOverTime={salesOverTime}
        currency={currency}
      />
    <div>
      {heading}
      {/* The grid is labelled so the numbers are not announced as one
          undifferentiated list. */}
      <dl className="grid grid-cols-2 gap-4" aria-label="Organizer summary">
        <StatCard label="Events" value={0} />
        <StatCard label="Tickets sold" value={0} />
        <StatCard label="Gross revenue" value="$0" />
        <StatCard label="Pending payouts" value="$0" />
      </dl>
    </div>
  );
}
