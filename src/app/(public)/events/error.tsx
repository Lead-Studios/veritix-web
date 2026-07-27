"use client";

import { useEffect } from "react";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Events error boundary caught an error", error);
  }, [error]);

  return (
    <RouteErrorState
      title="Events are temporarily unavailable"
      description="We couldn’t load the event listings right now. Please try again shortly."
      onRetry={reset}
    />
  );
}
