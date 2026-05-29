"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getToken, logout } from "@/lib/auth";

/**
 * Checks whether the stored JWT is expired.
 * Returns true if the token is missing or its `exp` claim is in the past.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * Returns the expiry timestamp (ms) from a JWT, or null if unreadable.
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * useSession – guards authenticated surfaces.
 *
 * - Redirects to /login immediately if no token is present.
 * - Redirects to /login (with ?expired=1) when the token has expired.
 * - Shows a toast when the session expires.
 * - Polls every 60 s so long-lived pages catch expiry without a page reload.
 */
export function useSession() {
  const router = useRouter();

  const checkSession = useCallback(() => {
    try {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      if (isTokenExpired(token)) {
        logout();
        toast.error("Your session has expired. Please sign in again.");
        router.replace("/login?expired=1");
      }
    } catch {
      logout();
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    checkSession();
    const id = setInterval(checkSession, 60_000);
    return () => clearInterval(id);
  }, [checkSession]);
}
