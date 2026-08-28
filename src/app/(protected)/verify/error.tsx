'use client';

import { useEffect } from 'react';
import { RouteErrorState } from '@/components/ui/RouteErrorState';

export default function VerifyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Verify error boundary caught an error', error);
  }, [error]);

  return (
    <RouteErrorState
      title="Verification unavailable"
      description="The verification experience hit an unexpected error. Please try again."
      onRetry={reset}
    />
  );
}
