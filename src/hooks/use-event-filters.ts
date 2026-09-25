'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * URL-driven state for the event filters.
 *
 * The query string is the single source of truth, so a filtered view is
 * shareable, bookmarkable, and survives a back/forward navigation. The hook
 * only ever rewrites the keys it owns, leaving unrelated parameters alone.
 */

export const EVENT_FILTER_KEYS = ['q', 'city', 'date', 'sort'] as const;

export type EventFilterKey = (typeof EVENT_FILTER_KEYS)[number];

export type EventFilters = Record<EventFilterKey, string>;

export const EMPTY_EVENT_FILTERS: EventFilters = {
  q: '',
  city: '',
  date: '',
  sort: '',
};

/** Shape shared by URLSearchParams and next/navigation's ReadonlyURLSearchParams. */
export interface SearchParamsLike {
  get(key: string): string | null;
}

/** Read the filter state back out of a query string. Missing keys become empty. */
export function parseEventFilters(searchParams: SearchParamsLike | null): EventFilters {
  const filters = { ...EMPTY_EVENT_FILTERS };

  for (const key of EVENT_FILTER_KEYS) {
    filters[key] = searchParams?.get(key)?.trim() ?? '';
  }

  return filters;
}

/** Serialize the filter state, dropping blank values so the URL stays tidy. */
export function toSearchParams(filters: EventFilters): URLSearchParams {
  const params = new URLSearchParams();

  for (const key of EVENT_FILTER_KEYS) {
    const value = filters[key].trim();
    if (value) params.set(key, value);
  }

  return params;
}

export interface UseEventFiltersResult {
  filters: EventFilters;
  /** Set one filter and push the whole set back into the URL. */
  setFilter: (key: EventFilterKey, value: string) => void;
  /** Drop every filter parameter, including any that are not recognised. */
  clearAll: () => void;
}

export function useEventFilters(): UseEventFiltersResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = React.useMemo(() => parseEventFilters(searchParams), [searchParams]);

  const write = React.useCallback(
    (next: EventFilters) => {
      const query = toSearchParams(next).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const setFilter = React.useCallback(
    (key: EventFilterKey, value: string) => write({ ...filters, [key]: value }),
    [filters, write],
  );

  const clearAll = React.useCallback(() => write(EMPTY_EVENT_FILTERS), [write]);

  return { filters, setFilter, clearAll };
}
