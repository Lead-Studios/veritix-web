"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/auth";

const WARN_BEFORE_MS = 5 * 60 * 1000; // 5 minutes

function msUntilExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (typeof payload.exp !== "number") return Infinity;
    return Math.max(0, payload.exp * 1000 - Date.now());
  } catch {
    return 0;
  }
}

export default function SessionExpiredBanner() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [extending, setExtending] = useState(false);

  const check = useCallback(() => {
    const token = getToken();
    if (!token) return;
    const remaining = msUntilExpiry(token);
    setVisible(remaining > 0 && remaining <= WARN_BEFORE_MS);
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, [check]);

  const handleExtend = async () => {
    setExtending(true);
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        setVisible(false);
      }
    } catch {
      // ignore
    } finally {
      setExtending(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 bg-amber-500 px-4 py-3 text-sm font-medium text-white shadow-lg"
    >
      <span>⚠️ Your session will expire in less than 5 minutes.</span>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleExtend}
          disabled={extending}
          className="rounded bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 disabled:opacity-60 transition"
        >
          {extending ? "Extending…" : "Extend Session"}
        </button>
        <button
          onClick={handleLogout}
          className="rounded bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
