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
        // The only heading this page can ever have, so h1 rather than the
        // default h2 — otherwise the document outline starts at level 2.
        titleAs="h1"
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
