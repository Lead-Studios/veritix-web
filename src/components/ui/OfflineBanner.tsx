"use client";

import React, { useEffect, useState } from "react";

interface OfflineBannerProps {
  /** Message shown when offline */
  offlineMessage?: string;
  /** Message shown when reconnecting */
  reconnectedMessage?: string;
  /** How long (ms) to show the reconnected notice before hiding */
  reconnectedDuration?: number;
  className?: string;
}

type NetworkState = "online" | "offline" | "reconnected";

/**
 * Displays a sticky banner when the user loses internet connectivity.
 * Shows a transient "back online" notice when connectivity is restored.
 *
 * Uses the browser `online` / `offline` events and `navigator.onLine`.
 */
export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  offlineMessage = "You appear to be offline. Some features may be unavailable.",
  reconnectedMessage = "You're back online!",
  reconnectedDuration = 3000,
  className = "",
}) => {
  const [state, setState] = useState<NetworkState>(
    typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "online"
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleOffline = () => setState("offline");
    const handleOnline = () => {
      setState("reconnected");
      timer = setTimeout(() => setState("online"), reconnectedDuration);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      clearTimeout(timer);
    };
  }, [reconnectedDuration]);

  if (state === "online") return null;

  const isOffline = state === "offline";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
        isOffline
          ? "bg-gray-900 text-gray-100"
          : "bg-emerald-600 text-white"
      } ${className}`}
    >
      <span aria-hidden="true" className="text-base">
        {isOffline ? "⚡" : "✓"}
      </span>
      {isOffline ? offlineMessage : reconnectedMessage}
    </div>
  );
};

export default OfflineBanner;