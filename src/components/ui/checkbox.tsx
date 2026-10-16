'use client';

import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  /**
   * Renders the mixed state and sets `aria-checked="mixed"`.
   *
   * `indeterminate` is a DOM property, not an attribute, so it cannot be set
   * from JSX — it is applied to the node in an effect below.
   */
  indeterminate?: boolean;
}

/**
 * Checkbox built on a native `<input type="checkbox">`.
 *
 * The input itself is kept in the accessibility tree and the tab order —
 * `appearance-none` removes only the platform painting, so checked state,
 * labelling and keyboard behaviour stay native. The tick is an overlay driven
 * by `peer-*` variants, and the focus ring comes from the shared `ring` token.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
        <input
          ref={setRefs}
          type="checkbox"
          // A checkbox in the mixed state is neither checked nor unchecked, and
          // only aria-checked can express that.
          aria-checked={indeterminate ? 'mixed' : undefined}
          className={cn(
            'peer size-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-input bg-background transition-colors',
            'checked:border-primary checked:bg-primary',
            'indeterminate:border-primary indeterminate:bg-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-[invalid=true]:border-destructive',
            className,
          )}
          {...props}
        />

        {/* Indicators are painted over the input and must never intercept
            clicks, or the label/input association stops working. */}
        <Check
          aria-hidden="true"
          className="pointer-events-none absolute hidden size-3 text-primary-foreground peer-checked:block peer-indeterminate:hidden"
        />
        <Minus
          aria-hidden="true"
          className="pointer-events-none absolute hidden size-3 text-primary-foreground peer-indeterminate:block"
        />
      </span>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
