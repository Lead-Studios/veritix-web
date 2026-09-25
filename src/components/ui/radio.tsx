'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

/**
 * Radio built on a native `<input type="radio">`.
 *
 * Grouping, arrow-key navigation between options and the single-selection
 * invariant are all native behaviour and depend on a shared `name`, so they are
 * deliberately not reimplemented here. `appearance-none` removes only the
 * platform painting; the dot is an overlay driven by `peer-checked`, and the
 * focus ring comes from the shared `ring` token.
 *
 * Wrap a set in a `<fieldset>` with a `<legend>` (or an element with
 * `role="radiogroup"` and a label) so the group itself is announced.
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        ref={ref}
        type="radio"
        className={cn(
          'peer size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-input bg-background transition-colors',
          'checked:border-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-[invalid=true]:border-destructive',
          className,
        )}
        {...props}
      />

      {/* Painted over the input, so it must not intercept clicks. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute hidden size-2 rounded-full bg-primary peer-checked:block"
      />
    </span>
  ),
);
Radio.displayName = 'Radio';

export { Radio };
