'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Sorting for the events listing.
 *
 * Writes a single `sort` query parameter, so the chosen order is shareable and
 * survives a reload. Date is the default and is kept out of the URL entirely —
 * only an explicit choice adds the parameter back.
 */

export const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const;

export type EventSortValue = (typeof SORT_OPTIONS)[number]['value'];

export const DEFAULT_EVENT_SORT: EventSortValue = 'date';

export interface EventSortProps {
  className?: string;
}

export function EventSort({ className }: EventSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requested = searchParams.get('sort');
  const value: EventSortValue = SORT_OPTIONS.some((option) => option.value === requested)
    ? (requested as EventSortValue)
    : DEFAULT_EVENT_SORT;

  const changeSort = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // The default is the absence of the parameter.
    if (next === DEFAULT_EVENT_SORT) params.delete('sort');
    else params.set('sort', next);

    // A new order invalidates the current page.
    params.delete('page');

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Label htmlFor="event-sort" className="flex shrink-0 items-center gap-2">
        <ArrowUpDown className="size-4" aria-hidden="true" />
        Sort
      </Label>
      <select
        id="event-sort"
        name="sort"
        value={value}
        onChange={(event) => changeSort(event.target.value)}
        className={cn(
          'h-10 rounded-md border border-input bg-background px-3 text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
