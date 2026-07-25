"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const DATE_FORMAT_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string | null): Date | undefined {
  if (!value || !DATE_FORMAT_RE.test(value)) return undefined;
  const d = new Date(`${value}T00:00:00Z`);
  return isNaN(d.getTime()) ? undefined : d;
}

function formatDate(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return date.toISOString().slice(0, 10);
}

/**
 * Syncs a date range to/from URL search params (`from` and `to` keys).
 * Falls back to `undefined` for missing or malformed values.
 *
 * @example
 * const { range, setRange } = useDateRangeParams();
 * // URL: ?from=2024-01-01&to=2024-01-31
 */
export function useDateRangeParams(
  fromKey = "from",
  toKey = "to"
): {
  range: DateRange;
  setRange: (range: DateRange) => void;
  clearRange: () => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const range = useMemo<DateRange>(
    () => ({
      from: parseDate(searchParams.get(fromKey)),
      to: parseDate(searchParams.get(toKey)),
    }),
    [searchParams, fromKey, toKey]
  );

  const setRange = useCallback(
    ({ from, to }: DateRange) => {
      const params = new URLSearchParams(searchParams.toString());

      const fromStr = formatDate(from);
      const toStr = formatDate(to);

      if (fromStr) {
        params.set(fromKey, fromStr);
      } else {
        params.delete(fromKey);
      }

      if (toStr) {
        params.set(toKey, toStr);
      } else {
        params.delete(toKey);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, fromKey, toKey]
  );

  const clearRange = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(fromKey);
    params.delete(toKey);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams, fromKey, toKey]);

  return { range, setRange, clearRange };
}