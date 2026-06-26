import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useVerifyStats } from '../hooks/useVerifyStats'

const MOCK_STATS = { capacity: 500, totalScanned: 120, remaining: 380 }

describe('useVerifyStats', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns loading=false and stats=null when eventId is null', () => {
    const { result } = renderHook(() => useVerifyStats(null))
    expect(result.current.stats).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('fetches stats when eventId is provided and returns data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => MOCK_STATS,
    } as Response)

    const { result } = renderHook(() => useVerifyStats('event-123'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.stats).toEqual(MOCK_STATS)
  })

  it('clears stats and stops polling when eventId becomes null', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => MOCK_STATS,
    } as Response)

    const { result, rerender } = renderHook(
      ({ id }: { id: string | null }) => useVerifyStats(id),
      { initialProps: { id: 'event-456' } }
    )

    await waitFor(() => expect(result.current.stats).toEqual(MOCK_STATS))

    act(() => { rerender({ id: null }) })

    expect(result.current.stats).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('silently ignores fetch errors and keeps stale data', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_STATS } as Response)
      .mockRejectedValueOnce(new Error('network failure'))

    vi.useFakeTimers({ shouldAdvanceTime: true })

    const { result } = renderHook(() => useVerifyStats('event-err'))

    await waitFor(() => expect(result.current.stats).toEqual(MOCK_STATS))

    // Trigger the second (failed) poll
    act(() => { vi.advanceTimersByTime(10_000) })
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2))

    // Data should be unchanged after the error
    expect(result.current.stats).toEqual(MOCK_STATS)

    vi.useRealTimers()
  })

  it('polls on the 10-second interval', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => MOCK_STATS,
    } as Response)

    vi.useFakeTimers({ shouldAdvanceTime: true })

    renderHook(() => useVerifyStats('event-poll'))

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1))

    act(() => { vi.advanceTimersByTime(10_000) })
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2))

    vi.useRealTimers()
  })
})
