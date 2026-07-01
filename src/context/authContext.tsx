"use client";

import { createContext, useEffect, useState } from 'react';

interface AuthUser { id: string; email: string; name?: string; role?: string; }
interface AuthContextValue { user: AuthUser | null; loading: boolean; login: (token: string, user: AuthUser) => void; logout: () => void; }

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setUser(await res.json());
      } catch { /* ignore */ }
      setLoading(false);
    };
    bootstrap();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
