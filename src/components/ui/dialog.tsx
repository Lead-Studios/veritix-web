'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Centred modal for content that needs the whole viewport.
 *
 * Deliberately dependency-free: the Radix dialog primitive is not installed in
 * this repo, and a lightbox only needs an overlay, a labelled panel, Escape
 * handling and a scroll lock. Swap the internals for Radix once it lands — the
 * props will not have to change.
 *
 * Controlled on purpose, so the caller owns the open state and can react to it.
 */

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name for the dialog. */
  title: string;
  description?: string;
  /** Extra classes for the panel, e.g. a wider max-width. */
  className?: string;
  children: React.ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    // Keep the page behind the dialog still while it is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex max-h-full w-full max-w-3xl flex-col gap-4',
          'overflow-auto rounded-lg border border-border bg-background p-6 shadow-lg',
          'focus-visible:outline-none',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold leading-none">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
}
