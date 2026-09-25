'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  /** Tooltip text. Kept to a string so it can also serve as an accessible name. */
  content: string;
  /**
   * The element the tooltip describes — typically an icon-only button. It is
   * cloned to attach the hover/focus handlers and the describedby wiring, so it
   * must be a single element that forwards props to a DOM node.
   */
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before opening on hover, in ms. Focus always opens immediately. */
  delayMs?: number;
  className?: string;
}

const SIDE_CLASSES: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
};

/**
 * Tooltip for icon-only controls.
 *
 * Opens on hover *and* on keyboard focus, which is the whole point — an
 * icon-only button whose label only appears on hover is unusable by keyboard.
 * It never takes or traps focus: the tooltip is `role="tooltip"` and is wired to
 * the trigger with `aria-describedby`, so the trigger keeps focus throughout and
 * Tab continues past it as normal.
 *
 * Escape dismisses it while the trigger stays focused, so a tooltip can never
 * obscure the content underneath with no way out.
 */
function Tooltip({
  content,
  children,
  side = 'top',
  delayMs = 0,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = React.useId();

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => clearTimer, [clearTimer]);

  const show = React.useCallback(
    (immediate: boolean) => {
      clearTimer();
      if (immediate || delayMs === 0) {
        setOpen(true);
        return;
      }
      timerRef.current = setTimeout(() => setOpen(true), delayMs);
    },
    [clearTimer, delayMs],
  );

  const hide = React.useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  const childProps = child.props;

  const trigger = React.cloneElement(child, {
    // Describedby rather than labelledby: the control keeps its own name and the
    // tooltip adds to it, instead of replacing it.
    'aria-describedby': open ? id : childProps['aria-describedby'],
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(event);
      show(false);
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(event);
      hide();
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event);
      // No delay on focus: a keyboard user has already committed to the control.
      show(true);
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event);
      hide();
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(event);
      if (event.key === 'Escape') hide();
    },
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            'absolute z-50 w-max max-w-xs rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md',
            SIDE_CLASSES[side],
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export { Tooltip };
