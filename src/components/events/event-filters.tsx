'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

/**
 * Date, city, and price filters for the events listing.
 *
 * Each filter is written straight to the query string, so a filtered view is
 * shareable and survives a reload, and the back button undoes one change at a
 * time. Rendered inline from `md` up and inside a `Sheet` below it.
 */

const FILTER_KEYS = ['city', 'date', 'minPrice', 'maxPrice'] as const;

type FilterKey = (typeof FILTER_KEYS)[number];
type FilterValues = Record<FilterKey, string>;

const EMPTY_FILTERS: FilterValues = { city: '', date: '', minPrice: '', maxPrice: '' };

export interface EventFiltersProps {
  className?: string;
}

/** Build the filter query while keeping any parameter the filters do not own. */
function withFilters(
  searchParams: URLSearchParams,
  changes: Partial<FilterValues>,
): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString());

  for (const [key, value] of Object.entries(changes)) {
    const trimmed = value?.trim();
    if (trimmed) next.set(key, trimmed);
    else next.delete(key);
  }

  // Any filter change invalidates the current page.
  next.delete('page');

  return next;
}

export function EventFilters({ className }: EventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const values = React.useMemo<FilterValues>(() => {
    const next = { ...EMPTY_FILTERS };
    for (const key of FILTER_KEYS) next[key] = searchParams.get(key) ?? '';
    return next;
  }, [searchParams]);

  const replace = React.useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const setFilter = React.useCallback(
    (key: FilterKey, value: string) => {
      replace(
        withFilters(new URLSearchParams(searchParams.toString()), { [key]: value }),
      );
    },
    [replace, searchParams],
  );

  const clearAll = React.useCallback(() => {
    replace(withFilters(new URLSearchParams(searchParams.toString()), EMPTY_FILTERS));
  }, [replace, searchParams]);

  const hasFilters = FILTER_KEYS.some((key) => values[key] !== '');

  const fields = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-city">City</Label>
        <Input
          id="filter-city"
          name="city"
          value={values.city}
          placeholder="Any city"
          onChange={(event) => setFilter('city', event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-date">Date</Label>
        <Input
          id="filter-date"
          name="date"
          type="date"
          value={values.date}
          onChange={(event) => setFilter('date', event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-min-price">Min price</Label>
        <Input
          id="filter-min-price"
          name="minPrice"
          type="number"
          min={0}
          inputMode="numeric"
          value={values.minPrice}
          placeholder="No minimum"
          onChange={(event) => setFilter('minPrice', event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-max-price">Max price</Label>
        <Input
          id="filter-max-price"
          name="maxPrice"
          type="number"
          min={0}
          inputMode="numeric"
          value={values.maxPrice}
          placeholder="No maximum"
          onChange={(event) => setFilter('maxPrice', event.target.value)}
        />
      </div>
    </div>
  );

  const clearButton = hasFilters ? (
    <Button variant="ghost" size="sm" onClick={clearAll}>
      Clear all
    </Button>
  ) : null;

  return (
    <div className={className}>
      {/* Inline from the md breakpoint up, where there is room for four fields. */}
      <Card className="hidden md:block">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Filters</CardTitle>
          {clearButton}
        </CardHeader>
        <CardContent className="p-6 pt-0">{fields}</CardContent>
      </Card>

      {/* Below md the same fields live behind a Sheet so the listing stays visible. */}
      <div className="md:hidden">
        <Sheet
          title="Filters"
          description="Narrow the listing by date, city, or price."
          triggerLabel={
            <>
              <SlidersHorizontal aria-hidden="true" />
              Filters
            </>
          }
        >
          {fields}
          {clearButton && <div className="mt-6">{clearButton}</div>}
        </Sheet>
      </div>
    </div>
  );
}
