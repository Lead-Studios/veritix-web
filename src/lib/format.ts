/**
 * Display formatters. Every user-facing number and date should pass through
 * one of these so formatting stays consistent across the app.
 */

const DEFAULT_LOCALE = 'en-US';

/** Format a minor-unit integer amount (e.g. cents) as currency. */
export function formatCurrency(
  minorUnits: number,
  currency = 'USD',
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(minorUnits / 100);
}

/** Format a Stellar stroop amount (7 decimal places) for display. */
export function formatXLM(stroops: bigint, maximumFractionDigits = 7): string {
  const whole = stroops / 10_000_000n;
  const frac = stroops % 10_000_000n;
  const fracStr = frac.toString().padStart(7, '0').replace(/0+$/, '').slice(0, maximumFractionDigits);
  return fracStr ? `${whole}.${fracStr}` : whole.toString();
}

export function formatNumber(value: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Medium-length absolute date, e.g. "Mar 14, 2026". */
export function formatDate(input: Date | string | number, locale = DEFAULT_LOCALE): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

/** Date with time, e.g. "Mar 14, 2026, 7:30 PM". */
export function formatDateTime(input: Date | string | number, locale = DEFAULT_LOCALE): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

/** Relative time, e.g. "in 3 days" or "2 hours ago". */
export function formatRelativeTime(
  input: Date | string | number,
  now: Date = new Date(),
  locale = DEFAULT_LOCALE,
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = date.getTime() - now.getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000_000],
    ['month', 2_592_000_000],
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ];

  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms) return rtf.format(Math.round(diffMs / ms), unit);
  }
  return rtf.format(Math.round(diffMs / 1000), 'second');
}

/** Shorten a Stellar address for display, e.g. "GABC…XYZ9". */
export function truncateAddress(address: string, lead = 4, tail = 4): string {
  if (address.length <= lead + tail + 1) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}
