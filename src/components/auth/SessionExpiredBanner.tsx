"use client";

import { useSearchParams } from "next/navigation";

export default function SessionExpiredBanner() {
  const params = useSearchParams();
  if (params.get("expired") !== "1") return null;

  return (
    <div role="alert" className="rounded-lg bg-yellow-500/20 border border-yellow-500/40 px-4 py-3 text-sm text-yellow-300 text-center">
      Your session has expired. Please sign in again.
    </div>
  );
}
