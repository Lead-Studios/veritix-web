"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getToken, logout } from "@/lib/auth";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

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
        toast.warn("Your session has expired. Please sign in again.");
        router.replace("/login?expired=1");
      }
    } catch {
      // Never crash — silently redirect to login
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    checkSession();
    const id = setInterval(checkSession, 60_000);
    return () => clearInterval(id);
  }, [checkSession]);
}
