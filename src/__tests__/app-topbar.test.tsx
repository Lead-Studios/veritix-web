import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppTopbar } from '@/components/layout/app-topbar';

const { routerPush, routerReplace, routerRefresh } = vi.hoisted(() => ({
  routerPush: vi.fn(),
  routerReplace: vi.fn(),
  routerRefresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: routerPush, replace: routerReplace, refresh: routerRefresh }),
}));

vi.mock('swr', () => ({
  default: () => ({
    data: { id: 'user-1', email: 'user@example.com', name: 'Sam Ali', avatarUrl: undefined },
  }),
}));

vi.mock('@/components/theme/theme-toggle', () => ({ ThemeToggle: () => null }));

afterEach(() => vi.unstubAllGlobals());

describe('AppTopbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the session profile and exposes profile, settings, and sign-out actions', async () => {
    const user = userEvent.setup();
    render(<AppTopbar />);

    const trigger = screen.getByRole('button', { name: 'Sam Ali account menu' });
    expect(trigger).toBeInTheDocument();
    await user.click(trigger);

    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: 'Profile' }));
    expect(routerPush).toHaveBeenCalledWith('/settings?tab=profile');
  });

  it('clears the server session and returns to the home page when signing out', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    render(<AppTopbar />);

    await user.click(screen.getByRole('button', { name: 'Sam Ali account menu' }));
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));

    await waitFor(() => expect(routerReplace).toHaveBeenCalledWith('/'));
    expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
    expect(routerRefresh).toHaveBeenCalled();
  });
});
