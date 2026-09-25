'use client';

import * as React from 'react';

/**
 * Checkout step wrapper: moves focus to the error summary on a failed
 * submit and announces step changes for screen readers.
 */
export default function CheckoutPage() {
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (error) errorSummaryRef.current?.focus();
  }, [error]);

  return (
    <div>
      <p role="status" aria-live="polite" className="sr-only">Step {step + 1}</p>
      {error && (
        <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="rounded-md border border-destructive p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
