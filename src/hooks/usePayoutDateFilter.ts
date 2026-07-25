"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type PayoutDatePreset = "7d" | "30d" | "90d" | "ytd" | "custom";

export interface PayoutDateFilter {
  preset: PayoutDatePreset | null;
  from: string | null; // YYYY-MM-DD
  to: string | null;   // YYYY-MM-DD
}

const PRESET_KEYS: Record<Exclude<PayoutDatePreset, "custom">, () => { from: string; to: string }> = {
  "7d": () => {
    const to = new Date();
    const from = new Date(Date.now() - 7 * 86400000);
    return { from: toISO(from), to: toISO(to) };
  },
  "30d": () => {
    const to = new Date();
    const from = new Date(Date.now() - 30 * 86400000);
    return { from: toISO(from), to: toISO(to) };
  },
  "90d": () => {
    const to = new Date();
    const from = new Date(Date.now() - 90 * 86400000);
    return { from: toISO(from), to: toISO(to) };
  },
  ytd: () => {
    const now = new Date();
    return {
      from: `${now.getFullYear()}-01-01`,
      to: toISO(now),
    };
  },
};

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * Manages payout date-range filter state via URL search params.
 * Supports named presets (7d, 30d, 90d, ytd) and custom from/to dates.
 *
 * @example
 * const { filter, setPreset, setCustomRange, clear } = usePayoutDateFilter();
 */
export function usePayoutDateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = useMemo<PayoutDateFilter>(() => ({
    preset: (searchParams.get("preset") as PayoutDatePreset) ?? null,
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  }), [searchParams]);

  const push = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null) {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const setPreset = useCallback(
    (preset: Exclude<PayoutDatePreset, "custom">) => {
      const { from, to } = PRESET_KEYS[preset]();
      push({ preset, from, to });
    },
    [push]
  );

  const setCustomRange = useCallback(
    (from: string, to: string) => {
      push({ preset: "custom", from, to });
    },
    [push]
  );

  const clear = useCallback(() => {
    push({ preset: null, from: null, to: null });
  }, [push]);

  return { filter, setPreset, setCustomRange, clear };
}