'use client';

import * as React from 'react';
import { ErrorState } from '@/components/feedback/error-state';
import { Container } from '@/components/layout/container';





/**
 * Route-segment error boundary. Next.js remounts this on a caught render error
 * and passes `reset` to retry the segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Sentry's Next.js integration captures this automatically in production;
    // logging keeps it visible in local development too.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-dvh items-center justify-center">
      <ErrorState
        className="w-full max-w-md"
        description={
          error.digest
            ? `We could not load this page. Reference: ${error.digest}`
            : 'We could not load this page. Please try again.'
        }
        onRetry={reset}
      />
    </Container>
  );
}



