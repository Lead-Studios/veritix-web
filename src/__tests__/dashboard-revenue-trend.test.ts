import { describe, it, expect } from 'vitest'

/**
 * Unit tests for the week-over-week revenue trend computation used in
 * dashboard/page.tsx (issue #364).
 *
 * The logic is extracted here for isolation:
 *   - Split data.revenue into current-week (last 7) and prior-week (prev 7)
 *   - trend = ((currentWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
 *   - Returns null when fewer than 14 data points or lastWeek total is 0
 */
function computeRevenueTrend(
  revenue: { day: string; revenue: number }[]
): number | null {
  if (revenue.length < 14) return null
  const currentWeek = revenue.slice(-7).reduce((sum, d) => sum + d.revenue, 0)
  const lastWeek = revenue.slice(-14, -7).reduce((sum, d) => sum + d.revenue, 0)
  if (lastWeek === 0) return null
  return ((currentWeek - lastWeek) / lastWeek) * 100
}

function makeRevenue(values: number[]): { day: string; revenue: number }[] {
  return values.map((revenue, i) => ({ day: `day-${i}`, revenue }))
}

describe('computeRevenueTrend', () => {
  it('returns null when revenue array has fewer than 14 entries', () => {
    expect(computeRevenueTrend(makeRevenue([100, 200]))).toBeNull()
    expect(computeRevenueTrend(makeRevenue(Array(13).fill(100)))).toBeNull()
  })

  it('returns null when last-week total is 0 (avoid division by zero)', () => {
    const revenue = makeRevenue([...Array(7).fill(0), ...Array(7).fill(200)])
    expect(computeRevenueTrend(revenue)).toBeNull()
  })

  it('returns positive trend when current week outperforms last week', () => {
    // last week: 7 × 100 = 700, current week: 7 × 200 = 1400 → +100%
    const revenue = makeRevenue([...Array(7).fill(100), ...Array(7).fill(200)])
    const trend = computeRevenueTrend(revenue)
    expect(trend).toBeCloseTo(100)
  })

  it('returns negative trend when current week underperforms last week', () => {
    // last week: 7 × 200 = 1400, current week: 7 × 100 = 700 → -50%
    const revenue = makeRevenue([...Array(7).fill(200), ...Array(7).fill(100)])
    const trend = computeRevenueTrend(revenue)
    expect(trend).toBeCloseTo(-50)
  })

  it('returns 0 when both weeks are identical', () => {
    const revenue = makeRevenue(Array(14).fill(500))
    expect(computeRevenueTrend(revenue)).toBeCloseTo(0)
  })

  it('uses only the last 14 entries when the array is longer', () => {
    // Prepend noise; only the last 14 matter
    const noise = Array(20).fill(9999)
    const signal = [...Array(7).fill(100), ...Array(7).fill(150)]
    const revenue = makeRevenue([...noise, ...signal])
    const trend = computeRevenueTrend(revenue)
    // 150/100 - 1 = +50%
    expect(trend).toBeCloseTo(50)
  })
})
