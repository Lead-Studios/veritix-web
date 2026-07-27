"use client";

import { useEffect } from "react";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function TicketsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tickets error boundary caught an error", error);
  }, [error]);

  return (
    <RouteErrorState
      title="Tickets unavailable"
      description="We couldn’t load your tickets right now. Please try again."
      onRetry={reset}
    />
  );
}
