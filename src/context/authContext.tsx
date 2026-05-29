'use client';

import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext<{ user: unknown; loading: boolean } | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = await res.json();
        setUser(user);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};