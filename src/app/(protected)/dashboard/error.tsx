"use client";

import { useEffect } from "react";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary caught an error", error);
  }, [error]);

  return (
    <RouteErrorState
      title="Dashboard unavailable"
      description="We could not load the dashboard right now. Please try again in a moment."
      onRetry={reset}
    />
  );
}
