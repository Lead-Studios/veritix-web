'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Selector for elements that can hold focus inside the dialog. Elements with a
 * negative tabindex are excluded because they are programmatically focusable
 * but deliberately outside the tab order.
 */
const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [contenteditable], [tabindex]:not([tabindex^="-"])';

interface DialogContextValue {
  titleId: string;
  descriptionId: string;
  onClose: () => void;
  /** Set by DialogDescription so aria-describedby is only emitted when one exists. */
  registerDescription: () => void;
  hasDescription: boolean;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

/** No-op subscribe: the value never changes after the first client render. */
const subscribeToNothing = () => () => {};

/**
 * False while server-rendering, true once on the client.
 *
 * `createPortal` needs a DOM target, which does not exist during SSR. This is
 * `useSyncExternalStore` rather than a `useState` + `useEffect` mount flag
 * because setting state inside an effect triggers an extra render pass, and the
 * `react-hooks/set-state-in-effect` rule rejects it.
 */
function useIsClient(): boolean {
  return React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

function useDialogContext(component: string): DialogContextValue {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error(`<${component}> must be rendered inside <Dialog>`);
  }
  return context;
}

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * Controlled modal dialog.
 *
 * Owns the behaviour that makes a modal usable rather than merely visible:
 * focus moves in on open and is trapped until close, Escape and a click on the
 * overlay both close it, background scrolling is locked, and focus returns to
 * whatever opened it.
 *
 * Rendered through a portal on `document.body` so it escapes any ancestor with
 * `overflow: hidden` or a stacking context of its own.
 */
function Dialog({ open, onOpenChange, children }: DialogProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const [hasDescription, setHasDescription] = React.useState(false);

  const registerDescription = React.useCallback(() => setHasDescription(true), []);
  const onClose = React.useCallback(() => onOpenChange(false), [onOpenChange]);

  const value = React.useMemo<DialogContextValue>(
    () => ({ titleId, descriptionId, onClose, registerDescription, hasDescription }),
    [titleId, descriptionId, onClose, registerDescription, hasDescription],
  );

  if (!open) return null;

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Set false for a dialog that must be dismissed with an explicit action. */
  closeOnOverlayClick?: boolean;
  /** Hides the corner close button when the footer already offers a dismiss. */
  showCloseButton?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    { className, children, closeOnOverlayClick = true, showCloseButton = true, ...props },
    forwardedRef,
  ) => {
    const { titleId, descriptionId, onClose, hasDescription } =
      useDialogContext('DialogContent');
    const panelRef = React.useRef<HTMLDivElement | null>(null);

    const isClient = useIsClient();

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    // Move focus in on open and hand it back to the trigger on close. Reading
    // activeElement in a layout effect catches it before the portal paints.
    React.useLayoutEffect(() => {
      const previouslyFocused = document.activeElement as HTMLElement | null;

      const panel = panelRef.current;
      if (panel) {
        const first = panel.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? panel).focus();
      }

      return () => previouslyFocused?.focus?.();
    }, [isClient]);

    // Lock background scrolling, restoring whatever the document already had
    // rather than assuming it was scrollable.
    React.useEffect(() => {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }, []);

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );

      // Nothing to cycle between: keep focus on the panel rather than letting
      // Tab escape to the page behind the overlay.
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    if (!isClient) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onKeyDown={onKeyDown}
      >
        {/* Overlay is presentational: the dialog itself carries the semantics. */}
        <div
          data-testid="dialog-overlay"
          aria-hidden="true"
          className="absolute inset-0 bg-foreground/50"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />

        <div
          ref={setRefs}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={hasDescription ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(
            'relative z-10 w-full max-w-lg rounded-[var(--radius)] border border-border bg-card p-6 text-card-foreground shadow-lg',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            className,
          )}
          {...props}
        >
          {children}

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                'absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors',
                'hover:bg-secondary hover:text-secondary-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>,
      document.body,
    );
  },
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-4 flex flex-col gap-1.5 pr-8', className)}
    {...props}
  />
));
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { titleId } = useDialogContext('DialogTitle');
  return (
    <h2
      ref={ref}
      id={titleId}
      className={cn('text-lg font-semibold leading-none text-foreground', className)}
      {...props}
    />
  );
});
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { descriptionId, registerDescription } = useDialogContext('DialogDescription');

  React.useEffect(() => registerDescription(), [registerDescription]);

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className,
    )}
    {...props}
  />
));
DialogFooter.displayName = 'DialogFooter';

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
