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
 * Returns milliseconds until the token expires, or 0 if already expired.
 */
function msUntilExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (typeof payload.exp !== "number") return 0;
    return Math.max(0, payload.exp * 1000 - Date.now());
  } catch {
    return 0;
  }
}

/**
 * useSession – guards authenticated surfaces.
 *
 * - Redirects to /login immediately if no token is present.
 * - Shows a toast and redirects to /login when the token has expired.
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
        toast.warn("Your session has expired. Please sign in again.", {
          toastId: "session-expired",
        });
        router.replace("/login?expired=1");
        return;
      }
      // Warn 5 minutes before expiry
      const remaining = msUntilExpiry(token);
      if (remaining > 0 && remaining <= 5 * 60 * 1000) {
        toast.info("Your session will expire in less than 5 minutes.", {
          toastId: "session-expiring-soon",
        });
      }
    } catch {
      // Never crash the page due to session check failure
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    checkSession();
    const id = setInterval(checkSession, 60_000);
    return () => clearInterval(id);
  }, [checkSession]);
}
