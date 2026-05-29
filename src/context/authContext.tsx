"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<{
  user: { id: string; email: string; name?: string } | null;
  loading: boolean;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
'use client';

import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext<{ user: unknown; loading: boolean } | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token =
        localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
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
