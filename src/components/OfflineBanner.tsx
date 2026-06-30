"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-yellow-500 px-4 py-2 text-sm font-semibold text-black"
    >
      <WifiOff size={16} />
      You are offline — some features may be unavailable.
    </div>
  );
}
