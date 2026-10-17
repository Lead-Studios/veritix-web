'use client';

import * as React from 'react';
import type { User } from '@/types';

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface SessionContextValue {
  user: User | null;
  status: SessionStatus;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);

async function requestUser(path: string, body?: unknown): Promise<User> {
  const response = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    const message =
      response.status === 401
        ? 'Your session has expired. Please sign in again.'
        : `The request failed with status ${response.status}.`;
    throw Object.assign(new Error(message), { status: response.status });
  }

  return (await response.json()) as User;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [status, setStatus] = React.useState<SessionStatus>('loading');

  React.useEffect(() => {
    let cancelled = false;

    void requestUser('/api/auth/session')
      .then((currentUser) => {
        if (cancelled) return;
        setUser(currentUser);
        setStatus('authenticated');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setUser(null);
        setStatus(
          error && typeof error === 'object' && 'status' in error && error.status === 401
            ? 'unauthenticated'
            : 'error',
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    const signedInUser = await requestUser('/api/auth/login', { email, password });
    setUser(signedInUser);
    setStatus('authenticated');
    return signedInUser;
  }, []);

  const signOut = React.useCallback(async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Sign-out failed with status ${response.status}.`);
    }
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = React.useMemo(
    () => ({ user, status, signIn, signOut }),
    [user, status, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = React.useContext(SessionContext);
  if (!value) throw new Error('useSession must be used within a SessionProvider.');
  return value;
}
