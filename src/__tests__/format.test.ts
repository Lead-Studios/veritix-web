import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, formatXLM, truncateAddress } from '@/lib/format';

describe('formatCurrency', () => {
  it('renders minor units as a currency string', () => {
    expect(formatCurrency(12_345)).toBe('$123.45');
  });

  it('honours a non-default currency', () => {
    expect(formatCurrency(5_000, 'EUR', 'de-DE')).toContain('50');
  });
});

describe('formatXLM', () => {
  it('converts stroops to a trimmed decimal string', () => {
    expect(formatXLM(10_000_000n)).toBe('1');
    expect(formatXLM(15_000_000n)).toBe('1.5');
  });

  it('keeps precision beyond Number.MAX_SAFE_INTEGER', () => {
    expect(formatXLM(90_071_992_547_409_910n)).toBe('9007199254.740991');
  });
});

describe('formatDate', () => {
  it('returns an empty string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('truncateAddress', () => {
  it('shortens a long address and leaves a short one alone', () => {
    expect(truncateAddress('GABCDEFGHIJKLMNOP')).toBe('GABC…MNOP');
    expect(truncateAddress('GABC')).toBe('GABC');
  });
});
