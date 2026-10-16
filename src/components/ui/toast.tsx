'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_DURATION_MS = 5000;

export type ToastVariant = 'default' | 'success' | 'error';

export interface ToastOptions {
  title: string;
  /** Optional detail line under the title. */
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. Pass `null` to require a manual dismiss. */
  duration?: number | null;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  /** Queues a toast and returns its id, so a caller can dismiss it early. */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/**
 * Access the toast queue.
 *
 * Throws outside the provider rather than silently doing nothing — a write
 * action that reports neither success nor failure is worse than a crash in
 * development.
 */
export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  default: 'border-border bg-card text-card-foreground',
  success: 'border-success/40 bg-card text-card-foreground',
  error: 'border-destructive/40 bg-card text-card-foreground',
};

const ACCENT_CLASSES: Record<ToastVariant, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  error: 'bg-destructive',
};

interface ToastItemProps {
  record: ToastRecord;
  onDismiss: (id: string) => void;
}

function ToastItem({ record, onDismiss }: ToastItemProps) {
  const { id, title, description, variant = 'default', duration } = record;

  React.useEffect(() => {
    if (duration === null) return;
    const timer = setTimeout(() => onDismiss(id), duration ?? DEFAULT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-[var(--radius)] border p-4 pr-10 shadow-lg',
        VARIANT_CLASSES[variant],
      )}
    >
      {/* Colour alone never carries the meaning — the title says what happened. */}
      <span
        aria-hidden="true"
        className={cn('absolute inset-y-0 left-0 w-1', ACCENT_CLASSES[variant])}
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label={`Dismiss: ${title}`}
        className={cn(
          'absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors',
          'hover:bg-secondary hover:text-secondary-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Cap on simultaneous toasts. The oldest is dropped past this. */
  limit?: number;
}

/**
 * Provides the toast queue and renders the live region that announces it.
 *
 * Every write action needs to report success or failure and there was no
 * mechanism for it. Mounted once in `AppProviders`.
 *
 * The viewport is always rendered, even with nothing in it: `aria-live` regions
 * are only announced when content is inserted into a region that already exists,
 * so creating it alongside the first toast would silently announce nothing.
 * `polite` means a toast waits for a pause rather than interrupting, which is
 * right for confirmations — it is not an alert.
 */
export function ToastProvider({ children, limit = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const counterRef = React.useRef(0);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => setToasts([]), []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      // A counter, not Math.random or Date.now: ids must be unique even for two
      // toasts queued in the same tick.
      counterRef.current += 1;
      const id = `toast-${counterRef.current}`;
      setToasts((current) => [...current, { ...options, id }].slice(-limit));
      return id;
    },
    [limit],
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        // Not role="alert": that is assertive and would interrupt.
        aria-live="polite"
        // Each toast is announced on its own rather than re-reading the queue.
        aria-atomic="false"
        aria-label="Notifications"
        className="pointer-events-none fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4"
      >
        {toasts.map((record) => (
          <ToastItem key={record.id} record={record} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
