import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SWRConfig } from 'swr';
// Type-only, so it is erased before the `api-client` mock below is hoisted.
import type { NotificationPreferences } from '@/components/settings/notification-form';
import type { User } from '@/types';

const { toastMock, patchMock, postMock, getMock, routerReplace } = vi.hoisted(() => ({
  toastMock: { success: vi.fn(), error: vi.fn() },
  patchMock: vi.fn(),
  postMock: vi.fn(),
  getMock: vi.fn(),
  routerReplace: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: toastMock,
  ToastContainer: () => null,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: routerReplace, push: vi.fn() }),
  usePathname: () => '/settings',
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('@/lib/api-client', () => ({
  api: { patch: patchMock, post: postMock, get: getMock },
  // The page reads through SWR, which is handed this as its fetcher.
  fetcher: (path: string) => getMock(path),
  ApiError: class extends Error {},
}));

// Imported after the mocks so the components pick them up.
const { ProfileForm, AVATAR_MAX_BYTES, validateAvatar } = await import(
  '@/components/settings/profile-form'
);
const { PasswordForm } = await import('@/components/settings/password-form');
const { DEFAULT_PREFERENCES, NotificationForm } = await import(
  '@/components/settings/notification-form'
);
const { parseSettingsTab, SETTINGS_TABS, default: SettingsPage } = await import(
  '@/app/(protected)/settings/page'
);
const { useSearchParams } = await import('next/navigation');

const USER: User = { id: 'user_1', email: 'umi@example.com', name: 'Umi' };

/** jsdom has no object-URL plumbing, which the avatar preview needs. */
function stubObjectUrl() {
  let counter = 0;
  const revoked: string[] = [];
  URL.createObjectURL = vi.fn(() => `blob:mock-${++counter}`);
  URL.revokeObjectURL = vi.fn((url: string) => void revoked.push(url));
  return { revoked };
}

/** A real File of a given type and size, since jsdom will not synthesise one. */
function makeFile(name: string, type: string, sizeBytes: number): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

beforeEach(() => {
  toastMock.success.mockClear();
  toastMock.error.mockClear();
  patchMock.mockReset();
  postMock.mockReset();
  getMock.mockReset();
  routerReplace.mockReset();
});

describe('validateAvatar', () => {
  it('accepts the formats the help text promises', () => {
    for (const type of ['image/png', 'image/jpeg', 'image/webp']) {
      expect(validateAvatar(makeFile('a', type, 1024)), type).toBeNull();
    }
  });

  it('rejects a format outside the promise, naming the accepted ones', () => {
    expect(validateAvatar(makeFile('a.tiff', 'image/tiff', 1024))).toMatch(/PNG, JPEG, or WebP/);
  });

  it('rejects a file over the size cap and says how far over it is', () => {
    const problem = validateAvatar(makeFile('big.png', 'image/png', AVATAR_MAX_BYTES + 1));
    expect(problem).toMatch(/under 2.0 MB/);
    expect(problem).toMatch(/2.0 MB/);
  });

  it('rejects an empty file', () => {
    expect(validateAvatar(makeFile('empty.png', 'image/png', 0))).toMatch(/empty/);
  });
});

describe('ProfileForm', () => {
  it('blocks submission until there is a display name', async () => {
    stubObjectUrl();
    render(<ProfileForm user={USER} />);

    const input = screen.getByLabelText(/display name/i);
    await userEvent.clear(input);

    expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    expect(screen.getByText('Enter a display name')).toBeInTheDocument();
    // Nothing was ever picked, so there is no URL to leak.
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('releases the preview of a rejected file and of a saved one', async () => {
    const { revoked } = stubObjectUrl();
    patchMock.mockResolvedValue(USER);
    render(<ProfileForm user={USER} />);

    // Rejected by size, so no URL is created and the previous one is released.
    await userEvent.upload(
      screen.getByLabelText(/avatar/i),
      makeFile('huge.png', 'image/png', AVATAR_MAX_BYTES + 1),
    );
    expect(URL.createObjectURL).not.toHaveBeenCalled();

    // Accepted, then saved, which clears the selection and frees the blob.
    await userEvent.upload(screen.getByLabelText(/avatar/i), makeFile('ok.png', 'image/png', 1024));
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(patchMock).toHaveBeenCalledOnce());
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(revoked).toEqual(['blob:mock-1']);
  });

  it('releases the last preview when the form unmounts', async () => {
    const { revoked } = stubObjectUrl();
    const { unmount } = render(<ProfileForm user={USER} />);

    await userEvent.upload(screen.getByLabelText(/avatar/i), makeFile('ok.png', 'image/png', 1024));
    expect(revoked).toEqual([]);

    unmount();
    expect(revoked).toEqual(['blob:mock-1']);
  });

  it('sends a JSON body when only the name changed', async () => {
    stubObjectUrl();
    patchMock.mockResolvedValue({ ...USER, name: 'Umi A' });
    render(<ProfileForm user={USER} />);

    const input = screen.getByLabelText(/display name/i);
    await userEvent.clear(input);
    await userEvent.type(input, 'Umi A');
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(patchMock).toHaveBeenCalledOnce());
    const [path, body] = patchMock.mock.calls[0];
    expect(path).toBe('/settings/profile');
    expect(body).toEqual({ displayName: 'Umi A' });
    expect(toastMock.success).toHaveBeenCalledWith('Profile updated');
  });

  it('sends FormData once an avatar is chosen, and previews it', async () => {
    stubObjectUrl();
    patchMock.mockResolvedValue({ ...USER, name: 'Umi', avatarUrl: 'https://cdn/avatar.png' });
    render(<ProfileForm user={USER} />);

    const file = makeFile('me.png', 'image/png', 2048);
    await userEvent.upload(screen.getByLabelText(/avatar/i), file);

    // The preview is the user's own file, before anything is uploaded.
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /umi/i })).toHaveAttribute(
        'src',
        'blob:mock-1',
      );
    });

    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    await waitFor(() => expect(patchMock).toHaveBeenCalledOnce());

    const body = patchMock.mock.calls[0][1] as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('displayName')).toBe('Umi');
    expect(body.get('avatar')).toBe(file);
  });

  it('refuses an oversized image before it is uploaded, and revokes nothing', async () => {
    const { revoked } = stubObjectUrl();
    render(<ProfileForm user={USER} />);

    await userEvent.upload(
      screen.getByLabelText(/avatar/i),
      makeFile('huge.png', 'image/png', AVATAR_MAX_BYTES + 1),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(/under 2.0 MB/);
    expect(patchMock).not.toHaveBeenCalled();
    expect(revoked).toEqual([]);
  });

  it('restricts the picker to the formats the help text promises', async () => {
    stubObjectUrl();
    render(<ProfileForm user={USER} />);

    // The `accept` attribute is what stops the OS dialog offering anything else;
    // `validateAvatar` is the check behind it for everything that gets past.
    const picker = screen.getByLabelText(/avatar/i) as HTMLInputElement;
    expect(picker.accept).toBe('image/png,image/jpeg,image/webp');
  });

  it('surfaces a save failure instead of claiming success', async () => {
    stubObjectUrl();
    patchMock.mockRejectedValue(new Error('That display name is taken'));
    render(<ProfileForm user={USER} />);

    const input = screen.getByLabelText(/display name/i);
    await userEvent.clear(input);
    await userEvent.type(input, 'Taken');
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(patchMock).toHaveBeenCalledOnce());
    expect(toastMock.error).toHaveBeenCalledWith('That display name is taken');
    expect(toastMock.success).not.toHaveBeenCalled();
  });
});

describe('PasswordForm', () => {
  const fill = async (current: string, next: string, confirm: string) => {
    await userEvent.type(screen.getByLabelText(/current password/i), current);
    await userEvent.type(screen.getByLabelText(/^new password/i), next);
    await userEvent.type(screen.getByLabelText(/confirm new password/i), confirm);
  };

  it('lists the policy and ticks each rule as it is met', async () => {
    stubObjectUrl();
    render(<PasswordForm />);

    const rules = screen.getByLabelText('Password requirements');
    expect(rules).toBeInTheDocument();
    expect(screen.getAllByText(/— not met yet/)).toHaveLength(5);

    await userEvent.type(screen.getByLabelText(/^new password/i), 'Abcdefghij1!');
    await waitFor(() => {
      expect(screen.getAllByText(/— met/)).toHaveLength(5);
    });
  });

  it('rejects a new password that does not meet the policy', async () => {
    stubObjectUrl();
    render(<PasswordForm />);

    await fill('old-password', 'weak', 'weak');
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));

    // The first unmet rule is named, and nothing is sent.
    await waitFor(() =>
      expect(screen.getByText('Use at least 12 characters')).toBeInTheDocument(),
    );
    expect(postMock).not.toHaveBeenCalled();
  });

  it('rejects a confirmation that does not match', async () => {
    stubObjectUrl();
    render(<PasswordForm />);

    await fill('old-password', 'Abcdefghij1!', 'Abcdefghij1?');
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => expect(screen.getByText('The passwords do not match')).toBeInTheDocument());
    expect(postMock).not.toHaveBeenCalled();
  });

  it('sends the change and reports how many other sessions were signed out', async () => {
    stubObjectUrl();
    postMock.mockResolvedValue({ sessionsRevoked: 3 });
    render(<PasswordForm />);

    await fill('old-password', 'Abcdefghij1!', 'Abcdefghij1!');
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => expect(postMock).toHaveBeenCalledOnce());
    const [path, body] = postMock.mock.calls[0];
    expect(path).toBe('/settings/password');
    // The confirmation is never sent; the server never needs to trust it.
    expect(body).toEqual({ currentPassword: 'old-password', newPassword: 'Abcdefghij1!' });
    expect(toastMock.success).toHaveBeenCalledWith(
      'Password changed — 3 other sessions signed out',
    );
  });

  it('uses the singular form when only one session was revoked', async () => {
    stubObjectUrl();
    postMock.mockResolvedValue({ sessionsRevoked: 1 });
    render(<PasswordForm />);

    await fill('old-password', 'Abcdefghij1!', 'Abcdefghij1!');
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() =>
      expect(toastMock.success).toHaveBeenCalledWith(
        'Password changed — 1 other session signed out',
      ),
    );
  });

  it('clears the form after a successful change, so the old password lingers nowhere', async () => {
    stubObjectUrl();
    postMock.mockResolvedValue({ sessionsRevoked: 0 });
    render(<PasswordForm />);

    await fill('old-password', 'Abcdefghij1!', 'Abcdefghij1!');
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => expect(postMock).toHaveBeenCalledOnce());
    await waitFor(() => {
      expect(screen.getByLabelText(/current password/i)).toHaveValue('');
    });
    expect(toastMock.success).toHaveBeenCalledWith('Password changed');
  });

  it('surfaces a wrong current password from the server', async () => {
    stubObjectUrl();
    postMock.mockRejectedValue(new Error('That is not your current password'));
    render(<PasswordForm />);

    await fill('wrong-password', 'Abcdefghij1!', 'Abcdefghij1!');
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() =>
      expect(toastMock.error).toHaveBeenCalledWith('That is not your current password'),
    );
  });
});

describe('NotificationForm', () => {
  const renderForm = (initial: NotificationPreferences) =>
    render(
      // `initial` skips the fetch, so the component is driven by the values the
      // page already has.
      <SWRConfig value={{ provider: () => new Map() }}>
        <NotificationForm initial={initial} />
      </SWRConfig>,
    );

  it('renders every preference as a labelled switch', () => {
    stubObjectUrl();
    renderForm(DEFAULT_PREFERENCES);

    expect(screen.getByRole('switch', { name: /event reminders/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /order receipts/i })).toBeChecked();
    // Marketing is opt-in, so it starts off.
    expect(screen.getByRole('switch', { name: /product news/i })).not.toBeChecked();
  });

  it('saves on change, not behind a button', async () => {
    stubObjectUrl();
    patchMock.mockResolvedValue({ marketing: true });
    renderForm(DEFAULT_PREFERENCES);

    await userEvent.click(screen.getByRole('switch', { name: /product news/i }));

    await waitFor(() => expect(patchMock).toHaveBeenCalledOnce());
    expect(patchMock.mock.calls[0][0]).toBe('/settings/notifications');
    expect(patchMock.mock.calls[0][1]).toEqual({ marketing: true });
    expect(toastMock.success).toHaveBeenCalledWith('Product news updated');
  });

  it('reverts the toggle when the save fails', async () => {
    stubObjectUrl();
    patchMock.mockRejectedValue(new Error('Network unreachable'));
    renderForm(DEFAULT_PREFERENCES);

    const toggle = screen.getByRole('switch', { name: /product news/i });
    await userEvent.click(toggle);

    // Optimistic on, then back off once the server has refused.
    await waitFor(() => expect(patchMock).toHaveBeenCalledOnce());
    await waitFor(() => expect(toggle).not.toBeChecked());
    expect(toastMock.error).toHaveBeenCalledWith('Network unreachable');
  });

  it('keeps the server as the source of truth for the whole set', async () => {
    stubObjectUrl();
    // The platform also turns marketing off, so the server's answer is not just
    // the toggle that was flipped.
    patchMock.mockResolvedValue({ ...DEFAULT_PREFERENCES, eventReminders: true, marketing: true });
    renderForm(DEFAULT_PREFERENCES);

    await userEvent.click(screen.getByRole('switch', { name: /product news/i }));

    await waitFor(() =>
      expect(screen.getByRole('switch', { name: /product news/i })).toBeChecked(),
    );
    expect(screen.getByRole('switch', { name: /order receipts/i })).toBeChecked();
  });
});

describe('parseSettingsTab', () => {
  it('accepts every known tab', () => {
    for (const tab of SETTINGS_TABS) {
      expect(parseSettingsTab(tab)).toBe(tab);
    }
  });

  it('falls back to the first tab for a missing or unknown value', () => {
    expect(parseSettingsTab(null)).toBe('profile');
    expect(parseSettingsTab(undefined)).toBe('profile');
    expect(parseSettingsTab('')).toBe('profile');
    // A stale bookmark, not an error.
    expect(parseSettingsTab('billing')).toBe('profile');
  });
});

describe('SettingsPage', () => {
  const renderPage = (query = '') => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams(query) as never);
    return render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <SettingsPage />
      </SWRConfig>,
    );
  };

  it('reads the account from the settings API', async () => {
    getMock.mockResolvedValue(USER);
    renderPage();

    await waitFor(() => expect(getMock).toHaveBeenCalledWith('/settings/profile'));
  });

  it('shows a skeleton until the account arrives, then the real form', async () => {
    let resolveAccount: (user: User) => void = () => {};
    getMock.mockReturnValue(new Promise<User>((resolve) => (resolveAccount = resolve)));
    const { container } = renderPage();

    // Nothing to edit yet, so the shape is held but the fields are not there.
    expect(container.querySelector('.bg-muted')).not.toBeNull();
    expect(screen.queryByLabelText(/display name/i)).not.toBeInTheDocument();

    resolveAccount(USER);

    await waitFor(() => expect(screen.getByLabelText(/display name/i)).toHaveValue('Umi'));
    expect(screen.getByRole('tab', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Wallet' })).toBeInTheDocument();
  });

  it('explains a failed load instead of spinning forever', async () => {
    getMock.mockRejectedValue(new Error('offline'));
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load your account/i);
  });

  it('only reads the tab parameter, leaving the rest of the query alone', async () => {
    getMock.mockResolvedValue(USER);
    renderPage('ref=email&tab=account');

    // `?tab=account` is honoured on the first paint, and the tab row itself is
    // untouched by it.
    const notifications = await screen.findByRole('tab', { name: 'Notifications' });
    await userEvent.click(notifications);

    expect(routerReplace).toHaveBeenCalledWith('/settings?ref=email&tab=notifications', {
      scroll: false,
    });
  });
});
