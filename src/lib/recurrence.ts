/**
 * Recurrence configuration & occurrence-generation helpers for event creation.
 *
 * Backend will receive the {@link RecurrenceConfig} object and is responsible
 * for actually generating the series of events. The helpers here are used by
 * the UI to preview the upcoming dates before submission.
 */

export type RecurrenceFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "custom";

export type CustomUnit = "day" | "week" | "month";

export type RecurrenceEndType = "never" | "count" | "date";

export interface RecurrenceConfig {
  frequency: RecurrenceFrequency;
  /** Every N units (>=1). Used by daily/weekly/monthly/custom. */
  interval: number;
  /** Unit for the custom frequency. */
  customUnit: CustomUnit;
  /** Sun=0..Sat=6. Used for weekly / custom-week. Empty = same weekday as start. */
  daysOfWeek: number[];
  endType: RecurrenceEndType;
  /** Number of occurrences when endType = "count". */
  count: number;
  /** Inclusive end date (YYYY-MM-DD) when endType = "date". */
  until: string;
}

export const DEFAULT_RECURRENCE: RecurrenceConfig = {
  frequency: "none",
  interval: 1,
  customUnit: "week",
  daysOfWeek: [],
  endType: "never",
  count: 10,
  until: "",
};

/** Hard cap for previews — protects the UI from runaway loops. */
export const PREVIEW_LIMIT = 5;
/** Hard cap for any generation (defensive). */
const ABSOLUTE_LIMIT = 365;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function dayLabel(d: number): string {
  return DAY_LABELS[((d % 7) + 7) % 7];
}

function parseLocalDate(yyyyMmDd: string): Date | null {
  if (!yyyyMmDd) return null;
  // Construct in local time to avoid TZ shifting the calendar day.
  const parts = yyyyMmDd.split("-").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function addMonths(d: Date, n: number): Date {
  const next = new Date(d);
  const targetMonth = next.getMonth() + n;
  next.setMonth(targetMonth);
  // Handle month-end clamping (e.g. Jan 31 + 1 month -> Feb 28/29).
  if (next.getMonth() !== ((targetMonth % 12) + 12) % 12) {
    next.setDate(0);
  }
  return next;
}

function startOfWeek(d: Date): Date {
  const out = new Date(d);
  out.setDate(out.getDate() - out.getDay());
  return out;
}

function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime();
}

function effectiveLimit(config: RecurrenceConfig, max: number): number {
  const ceil = Math.min(max, ABSOLUTE_LIMIT);
  if (config.endType === "count") {
    return Math.min(ceil, Math.max(1, Math.floor(config.count)));
  }
  return ceil;
}

/**
 * Generate occurrence dates for the given recurrence config.
 *
 * @param startDate - YYYY-MM-DD start date of the first occurrence.
 * @param config - Recurrence configuration.
 * @param max - Soft cap on the number of occurrences returned.
 */
export function generateOccurrences(
  startDate: string,
  config: RecurrenceConfig,
  max = PREVIEW_LIMIT
): Date[] {
  const start = parseLocalDate(startDate);
  if (!start) return [];
  if (config.frequency === "none") return [start];

  const limit = effectiveLimit(config, max);
  if (limit <= 0) return [];

  const until = config.endType === "date" ? parseLocalDate(config.until) : null;
  const interval = Math.max(1, Math.floor(config.interval || 1));

  const out: Date[] = [];
  const push = (d: Date) => {
    if (until && isAfter(d, until)) return false;
    out.push(d);
    return out.length < limit;
  };

  const unit: CustomUnit =
    config.frequency === "daily"
      ? "day"
      : config.frequency === "weekly"
      ? "week"
      : config.frequency === "monthly"
      ? "month"
      : config.customUnit;

  if (unit === "day") {
    let cursor = start;
    while (out.length < limit) {
      if (!push(cursor)) break;
      cursor = addDays(cursor, interval);
    }
    return out;
  }

  if (unit === "week") {
    const days =
      config.daysOfWeek.length > 0
        ? [...new Set(config.daysOfWeek)].sort((a, b) => a - b)
        : [start.getDay()];

    // Anchor on the week of the start date.
    let weekAnchor = startOfWeek(start);
    let safety = 0;
    while (out.length < limit && safety++ < ABSOLUTE_LIMIT) {
      for (const dow of days) {
        const candidate = addDays(weekAnchor, dow);
        if (candidate.getTime() < start.getTime()) continue;
        if (!push(candidate)) return out;
      }
      weekAnchor = addDays(weekAnchor, 7 * interval);
    }
    return out;
  }

  // month
  let cursor = start;
  while (out.length < limit) {
    if (!push(cursor)) break;
    cursor = addMonths(cursor, interval);
  }
  return out;
}

/** Short human-readable summary of the recurrence (for preview/summary panels). */
export function describeRecurrence(config: RecurrenceConfig): string {
  if (config.frequency === "none") return "Does not repeat";
  const interval = Math.max(1, Math.floor(config.interval || 1));
  const unit: CustomUnit =
    config.frequency === "daily"
      ? "day"
      : config.frequency === "weekly"
      ? "week"
      : config.frequency === "monthly"
      ? "month"
      : config.customUnit;

  const every =
    interval === 1 ? `Every ${unit}` : `Every ${interval} ${unit}s`;

  const dayPart =
    unit === "week" && config.daysOfWeek.length > 0
      ? ` on ${[...config.daysOfWeek]
          .sort((a, b) => a - b)
          .map(dayLabel)
          .join(", ")}`
      : "";

  const endPart =
    config.endType === "count"
      ? `, ${Math.max(1, Math.floor(config.count))} times`
      : config.endType === "date" && config.until
      ? `, until ${config.until}`
      : "";

  return `${every}${dayPart}${endPart}`;
}

/** Format a Date as a short human label, e.g. "Mon, Jun 1, 2026". */
export function formatOccurrenceLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
