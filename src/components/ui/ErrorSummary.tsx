'use client';

import React, { useEffect, useRef } from 'react';

export interface FieldError {
  /** Field name / id — used to build the href anchor */
  field: string;
  /** Human-readable error message */
  message: string;
}

interface ErrorSummaryProps {
  errors: FieldError[];
  /** Heading text */
  heading?: string;
  /** Extra class names */
  className?: string;
}

/**
 * WCAG 2.1 AA-compliant error summary component.
 *
 * When errors are present the summary:
 * - Receives focus automatically so screen readers announce it immediately
 * - Uses role="alert" + aria-live="assertive" for live-region announcement
 * - Lists each error as a link to its corresponding form field
 *
 * Place this above the form and ensure each field has a matching `id`.
 *
 * @example
 * <ErrorSummary errors={[{ field: "email", message: "Email is required" }]} />
 */
export const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  errors,
  heading = 'There are errors in this form',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Move focus to the summary when errors appear
  useEffect(() => {
    if (errors.length > 0) {
      ref.current?.focus();
    }
  }, [errors.length]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={-1}
      className={`rounded-lg border border-red-300 bg-red-50 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${className}`}
    >
      <h2 className="mb-2 text-base font-semibold text-red-800">{heading}</h2>
      <ul className="list-disc space-y-1 pl-5">
        {errors.map(({ field, message }) => (
          <li key={field} className="text-sm text-red-700">
            <a
              href={`#${field}`}
              className="underline hover:no-underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorSummary;
