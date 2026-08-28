import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useOrganizerAnalytics,
  type OrganizerAnalytics,
} from '@/hooks/useOrganizerAnalytics';

vi.mock('swr', () => ({
  default: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

const mockData: OrganizerAnalytics = {
  totalEvents: 5,
  totalTicketsSold: 120,
  totalRevenue: 150000,
  totalEarned: 100000,
  payoutsQueued: 20000,
  nextSettlementDays: 3,
  checkInsLive: true,
  doorsOpenInMinutes: 30,
  revenue: [{ day: 'Mon', revenue: 5000 }],
  performance: [{ day: 'Mon', value: 3000 }],
  ticketBreakdown: [{ type: 'VIP', count: 10, revenue: 50000 }],
  demographics: {
    region: [{ label: 'Lagos', count: 8, percentage: 80 }],
    deviceType: [{ label: 'Mobile', count: 9, percentage: 90 }],
    referralSource: [{ label: 'Instagram', count: 5, percentage: 50 }],
  },
  events: [{ id: 'evt-1', name: 'Afrobeats Night', remainingTickets: 40 }],
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

  it('omits the organizerId filter from the SWR key when organizerId is not provided', async () => {
    // NOTE: the current hook always builds a key (it does not gate the
    // fetch on `organizerId`), so a missing organizerId does not
    // prevent the request outright. What it does guarantee is that the
    // request is not scoped to a stale/undefined organizer — the
    // "organizerId" query param is simply omitted from the SWR key.
    const swr = await import('swr');
    vi.mocked(swr.default).mockReturnValue({
      data: null,
      error: undefined,
      isLoading: false,
    });

    renderHook(() => useOrganizerAnalytics());

    expect(swr.default).toHaveBeenCalledWith(
      '/api/organizer/analytics',
      expect.any(Function),
      expect.any(Object),
    );
    const [key] = vi.mocked(swr.default).mock.calls[0];
    expect(key).not.toContain('organizerId');
  });

  it('includes the organizerId filter in the SWR key when organizerId is provided', async () => {
    const swr = await import('swr');
    vi.mocked(swr.default).mockReturnValue({
      data: null,
      error: undefined,
      isLoading: false,
    });

    renderHook(() => useOrganizerAnalytics({ organizerId: 'org-1' }));

    expect(swr.default).toHaveBeenCalledWith(
      '/api/organizer/analytics?organizerId=org-1',
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
