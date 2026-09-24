'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Slide-over panel for content that does not fit inline on a small screen.
 *
 * Deliberately dependency-free: the add-on primitives in this repo (popover,
 * dialog) are not installed yet, and the filters panel only needs an overlay, a
 * close affordance, and Escape handling. Swap the internals for Radix once the
 * dialog primitive lands — the props will not have to change.
 */

export interface SheetProps {
  /** Visible panel heading, also used as the dialog's accessible name. */
  title: string;
  description?: string;
  /** Rendered inside the built-in trigger button. */
  triggerLabel: React.ReactNode;
  /** Controls the left/right edge the panel slides in from. */
  side?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

export function Sheet({
  title,
  description,
  triggerLabel,
  side = 'right',
  className,
  children,
}: SheetProps) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={cn(
              'absolute inset-y-0 flex w-4/5 max-w-sm flex-col gap-5 border-border',
              'bg-background p-6 shadow-lg focus-visible:outline-none',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-base font-semibold leading-none">{title}</p>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden="true" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
