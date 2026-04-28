'use client';

import { useState, useEffect } from 'react';
import { useSession } from './useSession';

export function useAuthState() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useSession handles the actual auth checking and redirects
  useSession();

  useEffect(() => {
    // Give a brief moment for auth to resolve
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true); // If we haven't been redirected, we're authenticated
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { isLoading, isAuthenticated };
}
