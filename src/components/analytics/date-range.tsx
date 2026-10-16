'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DatePicker, toIsoDate } from '@/components/ui/date-picker';
import { DEFAULT_RANGE_DAYS } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Shared date range control for analytics views.
 *
 * Presets and the custom range both write straight to the `from`/`to` query
 * parameters that `/api/analytics` and `/api/analytics/check-in-rate` read
 * (see `resolveAnalyticsRange` in `@/lib/analytics`), so a filtered view is
 * shareable and survives a reload — the same reasoning `EventFilters` uses
 * for the events listing.
 *
 * Dates are local calendar days throughout, via `DatePicker`'s own
 * `toIsoDate`/`fromIsoDate` — not the UTC days `resolveAnalyticsRange` uses
 * internally. The server falls back to its own default and clamps an
 * out-of-range span rather than erroring, so the one-day drift a UTC/local
 * mismatch could cause at a timezone boundary never produces a broken view.
 */

export interface DateRangeProps {
  className?: string;
}

interface Preset {
  label: string;
  days: number;
}

const PRESETS: Preset[] = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** Inclusive `from`/`to` for "last N days", ending today. */
function presetRange(
  days: number,
  today: Date = new Date(),
): { from: string; to: string } {
  return { from: toIsoDate(addDays(today, -(days - 1))), to: toIsoDate(today) };
}

function withRange(
  searchParams: URLSearchParams,
  from: string,
  to: string,
): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString());

  if (from) next.set('from', from);
  else next.delete('from');

  if (to) next.set('to', to);
  else next.delete('to');

  // A new range invalidates whatever page of results was showing.
  next.delete('page');

  return next;
}

export function DateRange({ className }: DateRangeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get('from') ?? '';
  const to = searchParams.get('to') ?? '';

  const [customOpen, setCustomOpen] = React.useState(false);
  // Draft values for the custom fields, so an in-progress edit doesn't push a
  // URL update — and a re-render of every analytics view reading it — per
  // keystroke.
  const [draftFrom, setDraftFrom] = React.useState(from);
  const [draftTo, setDraftTo] = React.useState(to);

  const replace = React.useCallback(
    (nextFrom: string, nextTo: string) => {
      const query = withRange(searchParams, nextFrom, nextTo).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const applyPreset = (days: number) => {
    const range = presetRange(days);
    setCustomOpen(false);
    replace(range.from, range.to);
  };

  const openCustom = () => {
    setDraftFrom(from);
    setDraftTo(to);
    setCustomOpen((open) => !open);
  };

  const applyCustom = () => {
    if (!draftFrom || !draftTo) return;
    replace(draftFrom, draftTo);
    setCustomOpen(false);
  };

  const matchingPresetDays = PRESETS.find((preset) => {
    const range = presetRange(preset.days);
    return range.from === from && range.to === to;
  })?.days;

  // No params yet is the server's own default window — reflect that in the
  // UI rather than showing no preset selected for what is, functionally, the
  // 30-day view every analytics page already renders.
  const activeDays =
    matchingPresetDays ?? (from === '' && to === '' ? DEFAULT_RANGE_DAYS : undefined);

  return (
    <div className={cn('flex flex-wrap items-end gap-2', className)}>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.days}
            type="button"
            variant={activeDays === preset.days ? 'default' : 'outline'}
            size="sm"
            onClick={() => applyPreset(preset.days)}
          >
            {preset.label}
          </Button>
        ))}
        <Button
          type="button"
          variant={customOpen || activeDays === undefined ? 'default' : 'outline'}
          size="sm"
          onClick={openCustom}
          aria-expanded={customOpen}
        >
          Custom range
        </Button>
      </div>

      {customOpen && (
        <div className="flex flex-wrap items-end gap-2">
          <DatePicker
            label="From"
            value={draftFrom}
            onChange={setDraftFrom}
            max={draftTo || undefined}
          />
          <DatePicker
            label="To"
            value={draftTo}
            onChange={setDraftTo}
            min={draftFrom || undefined}
          />
          <Button
            type="button"
            size="sm"
            onClick={applyCustom}
            disabled={!draftFrom || !draftTo}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
