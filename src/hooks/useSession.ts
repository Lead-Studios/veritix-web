'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getToken, logout } from '@/lib/auth';

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now();
  } catch (error: unknown) {
    console.error('Failed to parse JWT', error);
    return true;
  }
}

export function getTokenExpiry(token: string): number | null {
  try {
    const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch (error: unknown) {
    console.error('Failed to parse JWT', error);
    return null;
  }
}

export function msUntilExpiry(token: string): number {
  const expiry = getTokenExpiry(token);
  return expiry === null ? 0 : Math.max(0, expiry - Date.now());
}

export function useSession() {
  const router = useRouter();

  const checkSession = useCallback(() => {
    try {
      const token = getToken();
      if (!token) {
        router.replace('/login');
        return;
      }
      if (isTokenExpired(token)) {
        logout();
        toast.warn('Your session has expired. Please sign in again.', {
          toastId: 'session-expired',
        });
        router.replace('/login?expired=1');
        return;
      }
      if (msUntilExpiry(token) <= 5 * 60 * 1000) {
        toast.info('Your session will expire in less than 5 minutes.', {
          toastId: 'session-expiring-soon',
        });
      }
    } catch (error: unknown) {
      console.error('Session check failed', error);
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    checkSession();
    const id = setInterval(checkSession, 60_000);
    return () => clearInterval(id);
  }, [checkSession]);
}
