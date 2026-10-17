import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SessionProvider, useSession } from '@/context/session-context';

const USER = {
  id: 'user-1',
  email: 'user@example.test',
  name: 'Example User',
};

function SessionHarness() {
  const { user, status, signIn, signOut } = useSession();
  return (
    <div>
      <span>{status}</span>
      <span>{user?.email ?? 'no user'}</span>
      <button onClick={() => void signIn(USER.email, 'password')}>Sign in</button>
      <button onClick={() => void signOut()}>Sign out</button>
    </div>
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('SessionProvider', () => {
  it('keeps loading until the session request settles and exposes sign-in/out', async () => {
    let resolveSession!: (response: Response) => void;
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      if (String(input) === '/api/auth/session') {
        return new Promise<Response>((resolve) => {
          resolveSession = resolve;
        });
      }
      if (String(input) === '/api/auth/login') {
        return Promise.resolve(Response.json(USER));
      }
      return Promise.resolve(new Response(null, { status: 204 }));
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <SessionHarness />
      </SessionProvider>,
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(screen.getByText('no user')).toBeInTheDocument();
    resolveSession(Response.json(USER));
    await waitFor(() => expect(screen.getByText('authenticated')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(screen.getByText('unauthenticated')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(screen.getByText(USER.email)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
