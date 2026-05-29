"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { getToken, logout } from "@/lib/auth";
import { getTokenExpiry } from "@/hooks/useSession";

const WARN_BEFORE_MS = 5 * 60 * 1000; // 5 minutes
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function SessionExpiredBanner() {
  const router = useRouter();
  const params = useSearchParams();
  const [showWarning, setShowWarning] = useState(false);
  const [extending, setExtending] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    router.replace("/login");
  }, [router]);

  const handleExtend = useCallback(async () => {
    setExtending(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      if (data?.token) {
        localStorage.setItem("auth_token", data.token);
      }
      setShowWarning(false);
      toast.success("Session extended successfully.");
    } catch {
      toast.error("Could not extend session. Please sign in again.");
      handleLogout();
    } finally {
      setExtending(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const check = () => {
      const token = getToken();
      if (!token) return;
      const expiry = getTokenExpiry(token);
      if (expiry === null) return;
      const remaining = expiry - Date.now();
      if (remaining <= 0) {
        logout();
        router.replace("/login?expired=1");
      } else if (remaining <= WARN_BEFORE_MS) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, [router]);

  // Static expired message (redirected from useSession)
  if (params.get("expired") === "1") {
    return (
      <div
        role="alert"
        className="rounded-lg bg-yellow-500/20 border border-yellow-500/40 px-4 py-3 text-sm text-yellow-300 text-center"
      >
        Your session has expired. Please sign in again.
      </div>
    );
  }

  if (!showWarning) return null;

  return (
    <div
      role="alert"
      className="rounded-lg bg-orange-500/20 border border-orange-500/40 px-4 py-3 text-sm text-orange-300 flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      <span>Your session will expire in less than 5 minutes.</span>
      <div className="flex gap-2">
        <button
          onClick={handleExtend}
          disabled={extending}
          className="rounded bg-orange-500 px-3 py-1 text-white text-xs font-medium hover:bg-orange-600 disabled:opacity-50"
        >
          {extending ? "Extending…" : "Extend Session"}
        </button>
        <button
          onClick={handleLogout}
          className="rounded border border-orange-400 px-3 py-1 text-orange-300 text-xs font-medium hover:bg-orange-500/20"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
