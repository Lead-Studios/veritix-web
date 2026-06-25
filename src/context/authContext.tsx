"use client";

import React, { createContext, useState, useEffect } from "react";

interface AuthContextValue {
  user: { id: string; email: string; name?: string } | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const token =
        localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");

      if (!active) return;
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!active) return;
        const userData = await res.json();
        if (!active) return;
        setUser(userData);
      } catch {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
      } finally {
        if (active) setLoading(false);
      }
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
