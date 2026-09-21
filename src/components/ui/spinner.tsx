import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /** Announced to assistive tech. Pass null on a spinner inside a labelled region. */
  label?: string | null;
}

function Spinner({ className, label = 'Loading', ...props }: SpinnerProps) {
  return (
    <svg
      className={cn('size-4 animate-spin text-current', className)}
      viewBox="0 0 24 24"
      fill="none"
      role={label ? 'status' : 'none'}
      aria-label={label ?? undefined}
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export { Spinner };
