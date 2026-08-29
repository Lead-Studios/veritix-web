import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { getToken, loginUser, logout } from '@/lib/auth';
import { useSession } from '@/hooks/useSession';
import ProtectedLayout from '@/app/(protected)/layout';
import DashboardPage from '@/app/(protected)/dashboard/page';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/auth')>('@/lib/auth');
  return {
    ...actual,
    logout: vi.fn(),
  };
});

vi.mock('@/hooks/useOrganizerAnalytics', () => ({
  useOrganizerAnalytics: () => ({
    data: {
      totalEvents: 1,
      totalTicketsSold: 100,
      totalRevenue: 1000,
      totalEarned: 1000,
      payoutsQueued: 0,
      nextSettlementDays: 2,
      checkInsLive: false,
      revenue: [],
      performance: [],
      ticketBreakdown: [],
      demographics: {
        region: [],
        deviceType: [],
        referralSource: [],
      },
      events: [],
    },
    loading: false,
    error: null,
  }),
}));

function makeJwt(exp: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'u-1', exp }));
  return `${header}.${payload}.signature`;
}

function SessionGuard() {
  useSession();
  return <div>session checked</div>;
}

describe('login to dashboard session flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn(), replace: vi.fn() } as never);
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores the token on login and renders the dashboard after session validation', async () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600);
    const { apiClient } = await import('@/lib/apiClient');
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      token,
      user: { id: 'u-1', email: 'user@example.com' },
    });

    await loginUser({ email: 'user@example.com', password: 'password123' });
    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'user@example.com',
      password: 'password123',
    });
    expect(getToken()).toBe(token);

    render(
      <ProtectedLayout>
        <DashboardPage />
      </ProtectedLayout>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Create, Manage and Control your events efficiently/i),
      ).toBeInTheDocument();
    });
  });

  it('shows the expired-session toast and redirects when the token is expired', async () => {
    const replace = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn(), replace } as never);
    sessionStorage.setItem('auth_token', makeJwt(Math.floor(Date.now() / 1000) - 60));

    render(<SessionGuard />);

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        'Your session has expired. Please sign in again.',
        expect.objectContaining({ toastId: 'session-expired' }),
      );
    });
    expect(replace).toHaveBeenCalledWith('/login?expired=1');
    expect(logout).toHaveBeenCalled();
  });
});
