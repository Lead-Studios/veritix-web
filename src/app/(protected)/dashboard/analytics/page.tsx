'use client';

import * as React from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker, toIsoDate } from '@/components/ui/date-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency, formatDate } from '@/lib/format';
import type { AnalyticsRange, AnalyticsSnapshot } from '@/lib/analytics';

/** Quick ranges, in days ending today. */
const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
] as const;

function presetRange(days: number): AnalyticsRange {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1));
  return { from: toIsoDate(start), to: toIsoDate(today) };
}

/**
 * Organizer revenue view: gross, fees, refunds and net for a chosen range.
 *
 * Until the organizer picks a range the request carries none, so the API's own
 * default window applies and the pickers show whatever range it resolved. That
 * keeps "today" decided in one place instead of on both server and client.
 * Every amount goes through `formatCurrency`.
 */
export default function AnalyticsPage() {
  const [range, setRange] = React.useState<AnalyticsRange | null>(null);

  const key = range
    ? `/analytics?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`
    : '/analytics';
  // keepPreviousData so changing the range does not blank the figures while
  // the new ones load.
  const { data, error, isLoading, isValidating } = useSWR<AnalyticsSnapshot>(key, {
    keepPreviousData: true,
  });

  const from = range?.from ?? data?.range.from ?? '';
  const to = range?.to ?? data?.range.to ?? '';

  const updateBound = (bound: keyof AnalyticsRange) => (value: string) => {
    if (!value) return;
    // The API swaps a reversed range, but doing it here keeps the pickers
    // showing what is actually being reported.
    const next = { from, to, [bound]: value };
    setRange(next.from <= next.to ? next : { from: next.to, to: next.from });
  };

  const heading = (
    <div>
      <h1 className="text-2xl font-semibold">Revenue analytics</h1>
      <p className="text-sm text-muted-foreground">
        Gross sales, platform fees, and refunds across your events.
      </p>
    </div>
  );

  const controls = (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Date range</legend>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const presetValue = presetRange(preset.days);
          const active = presetValue.from === from && presetValue.to === to;
          return (
            <Button
              key={preset.days}
              size="sm"
              variant={active ? 'default' : 'outline'}
              aria-pressed={active}
              onClick={() => setRange(presetValue)}
            >
              {preset.label}
            </Button>
          );
        })}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker label="From" value={from} max={to || undefined} onChange={updateBound('from')} />
        <DatePicker label="To" value={to} min={from || undefined} onChange={updateBound('to')} />
      </div>
    </fieldset>
  );

  if (error && !data) {
    return (
      <div className="space-y-6">
        {heading}
        {controls}
        <Card>
          <CardHeader>
            <CardTitle>Revenue unavailable</CardTitle>
            <CardDescription>
              We could not load your revenue figures. Check your connection and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        {heading}
        {controls}
        <p role="status" className="sr-only">
          Loading revenue figures
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  const currency = data?.currency ?? 'USD';
  const totals = data?.totals;

  return (
    <div className="space-y-6">
      {heading}
      {controls}

      {/* Announces the range the figures belong to once they settle, so a
          change of range is not a silent swap of numbers. */}
      <p role="status" className="text-sm text-muted-foreground">
        {isValidating
          ? 'Updating figures…'
          : data && `Showing ${formatDate(`${data.range.from}T00:00:00`)} to ${formatDate(`${data.range.to}T00:00:00`)}.`}
      </p>

      <dl
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        aria-label="Revenue summary"
        aria-busy={isValidating}
      >
        <StatCard label="Gross revenue" value={formatCurrency(totals?.grossMinor ?? 0, currency)} />
        <StatCard label="Platform fees" value={formatCurrency(totals?.feesMinor ?? 0, currency)} />
        <StatCard label="Refunds" value={formatCurrency(totals?.refundedMinor ?? 0, currency)} />
        <StatCard label="Net after fees" value={formatCurrency(totals?.netMinor ?? 0, currency)} />
      </dl>

      <p className="text-xs text-muted-foreground">
        Net after fees is gross revenue minus platform fees (2.5% + {formatCurrency(99, currency)}{' '}
        per ticket) and refunds issued in the range.
      </p>
    </div>
  );
}
