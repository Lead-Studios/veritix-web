"use client";

import { useEffect } from "react";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function EventDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Event detail error boundary caught an error", error);
  }, [error]);

  return (
    <RouteErrorState
      title="Event details unavailable"
      description="We couldn’t load this event right now. Please try again."
      onRetry={reset}
    />
  );
}
