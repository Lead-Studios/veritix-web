import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useOrganizerAnalytics,
  type OrganizerAnalytics,
} from '@/hooks/useOrganizerAnalytics';

vi.mock('swr', () => ({
  default: vi.fn(),
}));

const mockData: OrganizerAnalytics = {
  revenue: [{ day: 'Mon', revenue: 5000 }],
  performance: [{ day: 'Mon', value: 3000 }],
  totalEarned: 100000,
  payoutsQueued: 20000,
  nextSettlementDays: 3,
  checkInsLive: true,
  doorsOpenInMinutes: 30,
  totalEvents: 5,
  ticketBreakdown: [{ type: 'VIP', count: 10, revenue: 50000 }],
  demographics: {
    region: [{ label: 'Lagos', count: 8, percentage: 80 }],
    deviceType: [{ label: 'Mobile', count: 9, percentage: 90 }],
    referralSource: [{ label: 'Instagram', count: 5, percentage: 50 }],
  },
};

describe('useOrganizerAnalytics', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the loading state while the request is pending', async () => {
    const swr = await import('swr');
    vi.mocked(swr.default).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    const { result } = renderHook(() => useOrganizerAnalytics());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns correctly shaped analytics data on success', async () => {
    const swr = await import('swr');
    vi.mocked(swr.default).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useOrganizerAnalytics({ organizerId: 'org-1' }));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('does not request analytics when organizerId is missing', async () => {
    const swr = await import('swr');
    vi.mocked(swr.default).mockReturnValue({
      data: null,
      error: undefined,
      isLoading: false,
    });

    renderHook(() => useOrganizerAnalytics());
    expect(swr.default).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object),
    );
  });

  it('surfaces API errors from the hook', async () => {
    const swr = await import('swr');
    vi.mocked(swr.default).mockReturnValue({
      data: null,
      error: new Error('Failed to fetch analytics'),
      isLoading: false,
    });

    const { result } = renderHook(() => useOrganizerAnalytics());

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Failed to fetch analytics');
    expect(result.current.loading).toBe(false);
  });
});
