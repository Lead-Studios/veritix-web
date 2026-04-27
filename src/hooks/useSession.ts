"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/auth";

/**
 * Checks whether the stored JWT is expired.
 * Returns true if the token is missing or its `exp` claim is in the past.
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * useSession – guards authenticated surfaces.
 *
 * - Redirects to /login immediately if no token is present.
 * - Redirects to /login (with ?expired=1) when the token has expired.
 * - Polls every 60 s so long-lived pages catch expiry without a page reload.
 */
export function useSession() {
  const router = useRouter();

  const checkSession = useCallback(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    if (isTokenExpired(token)) {
      logout();
      router.replace("/login?expired=1");
    }
  }, [router]);

  useEffect(() => {
    checkSession();
    const id = setInterval(checkSession, 60_000);
    return () => clearInterval(id);
  }, [checkSession]);
}
