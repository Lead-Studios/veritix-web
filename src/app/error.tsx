'use client';

import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
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
    // The boundary catches client render errors explicitly; server request errors
    // are handled by Sentry's instrumentation hook.
    Sentry.captureException(error, { tags: { boundary: 'app/error' } });
    if (process.env.NODE_ENV !== 'production') console.error(error);
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
