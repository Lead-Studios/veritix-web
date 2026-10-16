'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'value' | 'type' | 'role' | 'aria-checked'
> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/**
 * On/off switch for settings, following the ARIA switch pattern.
 *
 * Built on a `<button>` rather than a checkbox on purpose: a button responds to
 * both Space and Enter natively, whereas a checkbox only responds to Space, and
 * the requirement here is both. State lives in `aria-checked`, which is what a
 * screen reader announces as on/off.
 *
 * Controlled by design — a settings toggle whose value the parent does not own
 * cannot be persisted, so there is no uncontrolled mode. Pair it with a `<label>`
 * via `id`, or pass `aria-label` for an unlabelled toggle.
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange(!checked);
      }}
      className={cn(
        'inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        checked ? 'bg-primary' : 'bg-input',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {/* Decorative: the state is already conveyed by aria-checked. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  ),
);
Switch.displayName = 'Switch';

export { Switch };
