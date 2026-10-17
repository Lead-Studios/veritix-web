'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useEventFilters } from '@/hooks/use-event-filters';

const FILTER_KEYS = ['city', 'date', 'minPrice', 'maxPrice'] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

export interface EventFiltersProps {
  className?: string;
}

export function EventFilters({ className }: EventFiltersProps) {
  const { filters, setFilter, clearAll } = useEventFilters(FILTER_KEYS as readonly string[]);

  const values = React.useMemo(() => {
    const next = { city: '', date: '', minPrice: '', maxPrice: '' };
    for (const key of FILTER_KEYS) next[key] = (filters as any)[key] ?? '';
    return next;
  }, [filters]);

  const hasFilters = FILTER_KEYS.some((key) => values[key] !== '');

  const fields = (idPrefix: string) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-filter-city`}>City</Label>
        <Input
          id={`${idPrefix}-filter-city`}
          name="city"
          value={values.city}
          placeholder="Any city"
          onChange={(event) => setFilter('city', event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-filter-date`}>Date</Label>
        <Input
          id={`${idPrefix}-filter-date`}
          name="date"
          type="date"
          value={values.date}
          onChange={(event) => setFilter('date', event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-filter-min-price`}>Min price</Label>
        <Input
          id={`${idPrefix}-filter-min-price`}
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
        <Label htmlFor={`${idPrefix}-filter-max-price`}>Max price</Label>
        <Input
          id={`${idPrefix}-filter-max-price`}
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
      <Card className="hidden md:block">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle as="h2">Filters</CardTitle>
          {clearButton}
        </CardHeader>
        <CardContent className="p-6 pt-0">{fields('inline')}</CardContent>
      </Card>

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
          {fields('sheet')}
          {clearButton && <div className="mt-6">{clearButton}</div>}
        </Sheet>
      </div>
    </div>
  );
}
