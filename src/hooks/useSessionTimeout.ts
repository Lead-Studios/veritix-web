import { useEffect, useRef, useCallback } from "react";

interface Options {
  onWarn: () => void;
  onLogout: () => void;
  warnBeforeMs?: number;
}

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

interface SessionApiResponse {
  exp?: number;
}

function getTokenExpiry(): number | null {
  const token =
    localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
  if (!token) return null;
  try {
    const payload: JwtPayload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch (e: unknown) {
    console.error("Failed to parse JWT", e);
    return null;
  }
}

export function useSessionTimeout({
  onWarn,
  onLogout,
  warnBeforeMs = 2 * 60 * 1000,
}: Options) {
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedule = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) return;

      const { exp }: SessionApiResponse = await res.json();
      if (typeof exp !== "number") return;

      const expiry = exp * 1000;
      const now = Date.now();
      const warnAt = expiry - warnBeforeMs - now;
      const logoutAt = expiry - now;

      if (warnAt > 0) warnTimer.current = setTimeout(onWarn, warnAt);
      if (logoutAt > 0) logoutTimer.current = setTimeout(onLogout, logoutAt);
    } catch (e: unknown) {
      console.error("Failed to fetch session", e);
    }
  }, [onWarn, onLogout, warnBeforeMs]);

  useEffect(() => {
    schedule();
    return () => {
      if (warnTimer.current) clearTimeout(warnTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [schedule]);
}
