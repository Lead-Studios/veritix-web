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

/** Generic filter shape for components that own a different key set. */
export type GenericFilters = Record<string, string>;

export const EMPTY_EVENT_FILTERS: EventFilters = {
  q: '',
  city: '',
  date: '',
  sort: '',
};

export const EMPTY_GENERIC_FILTERS: GenericFilters = {};

/** Shape shared by URLSearchParams and next/navigation's ReadonlyURLSearchParams. */
export interface SearchParamsLike {
  get(key: string): string | null;
}

/** Read the filter state back out of a query string. Missing keys become empty. */
export function parseEventFilters(
  searchParams: SearchParamsLike | null,
  keys: readonly string[] = EVENT_FILTER_KEYS,
): Record<string, string> {
  const filters: Record<string, string> = {};
  for (const key of keys) {
    filters[key] = searchParams?.get(key)?.trim() ?? '';
  }
  return filters;
}

/** Serialize the filter state, dropping blank values so the URL stays tidy. */
export function toSearchParams(filters: GenericFilters, keys?: readonly string[]): URLSearchParams {
  const params = new URLSearchParams();
  const keysToWrite = keys ?? Object.keys(filters);
  for (const key of keysToWrite) {
    const value = filters[key]?.trim() ?? '';
    if (value) params.set(key, value);
  }
  return params;
}

export interface UseEventFiltersResult {
  filters: GenericFilters;
  /** Set one filter and push the whole set back into the URL. */
  setFilter: (key: string, value: string) => void;
  /** Drop every filter parameter owned by this hook, keeping unrelated ones. */
  clearAll: () => void;
}

export function useEventFilters(keys: readonly string[] = EVENT_FILTER_KEYS): UseEventFiltersResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = React.useMemo(() => parseEventFilters(searchParams, keys), [searchParams, keys]);

  const latestParams = React.useRef<URLSearchParams>(new URLSearchParams(searchParams?.toString() ?? ''));
  const latestFilters = React.useRef<Record<string, string>>(filters);

  React.useEffect(() => {
    latestParams.current = new URLSearchParams(searchParams?.toString() ?? '');
    latestFilters.current = filters;
  }, [searchParams, filters]);

  const write = React.useCallback(
    (next: GenericFilters) => {
      const merged = new URLSearchParams(latestParams.current.toString());
      for (const key of keys) {
        const value = next[key]?.trim() ?? '';
        if (value) merged.set(key, value);
        else merged.delete(key);
      }
      merged.delete('page');

      latestFilters.current = next;
      const query = merged.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      latestParams.current = merged;
    },
    [pathname, router, keys],
  );

  const setFilter = React.useCallback(
    (key: string, value: string) => {
      write({ ...latestFilters.current, [key]: value });
    },
    [write],
  );

  const clearAll = React.useCallback(() => {
    const empty: GenericFilters = {};
    for (const key of keys) empty[key] = '';
    write(empty);
  }, [write, keys]);

  return { filters, setFilter, clearAll };
}
