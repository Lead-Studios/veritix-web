import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Inline contextual message — an unpublished event, a pending payout, a failed
 * action.
 *
 * Colours resolve through the shared design tokens (the same `success`,
 * `warning`, and `destructive` used by `Badge`), so the component follows the
 * theme into dark mode rather than hard-coding a palette.
 *
 * The live-region role is opt-in: `role="alert"` interrupts the screen reader
 * mid-sentence, which is right for a failure the user just caused and wrong for
 * a piece of standing information they may never read. Everything not marked
 * `urgent` is a polite `role="status"` instead.
 */
const alertVariants = cva('relative flex gap-3 rounded-lg border p-4 text-sm', {
  variants: {
    variant: {
      info: 'border-accent/40 bg-accent/10',
      success: 'border-success/40 bg-success/10',
      warning: 'border-warning/40 bg-warning/10',
      destructive: 'border-destructive/40 bg-destructive/10',
    },
  },
  defaultVariants: { variant: 'info' },
});

const iconVariants = cva('mt-0.5 size-4 shrink-0', {
  variants: {
    variant: {
      info: 'text-accent',
      success: 'text-success',
      warning: 'text-warning',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: { variant: 'info' },
});

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

const ICONS: Record<AlertVariant, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
};

const DEFAULT_TITLES: Record<AlertVariant, string> = {
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  destructive: 'Error',
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  /** Short bold lead-in. Also names the region for assistive tech. */
  title?: React.ReactNode;
  /**
   * Mark a message that must interrupt the user, rendering `role="alert"`.
   * Reserved for urgent failures; leave it off for standing information.
   */
  urgent?: boolean;
  /** Adds a dismiss control when provided. */
  onDismiss?: () => void;
}

export function Alert({
  className,
  variant = 'info',
  title,
  urgent = false,
  onDismiss,
  children,
  ...props
}: AlertProps) {
  const resolvedVariant: AlertVariant = variant ?? 'info';
  const Icon = ICONS[resolvedVariant];
  const accessibleName = typeof title === 'string' ? title : DEFAULT_TITLES[resolvedVariant];

  return (
    <div
      role={urgent ? 'alert' : 'status'}
      aria-label={accessibleName}
      className={cn(alertVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      <Icon className={iconVariants({ variant: resolvedVariant })} aria-hidden />

      <div className="min-w-0 flex-1">
        {title && <p className="mb-0.5 font-semibold leading-snug text-foreground">{title}</p>}
        <div className="leading-relaxed text-foreground/90">{children}</div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            'ml-auto -mr-1 -mt-1 shrink-0 rounded p-1 opacity-60 transition-opacity',
            'hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            iconVariants({ variant: resolvedVariant }),
          )}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
