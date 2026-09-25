'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Focusable descendants, mirroring the selector used by `ui/dialog`. */
const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [contenteditable], [tabindex]:not([tabindex^="-"])';

/** No-op subscribe: the value never changes after the first client render. */
const subscribeToNothing = () => () => {};

/**
 * False while server-rendering, true once on the client. `createPortal` needs a
 * DOM target, which does not exist during SSR.
 */
function useIsClient(): boolean {
  return React.useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheet(component: string): SheetContextValue {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error(`${component} must be used inside Sheet`);
  return context;
}

export interface SheetProps {
  children?: React.ReactNode;
  /** Simple, self-contained trigger API used by responsive filter panels. */
  title?: string;
  description?: string;
  triggerLabel?: React.ReactNode;
  side?: Extract<SheetSide, 'left' | 'right'>;
  className?: string;
  /** Compound API used by application navigation. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sheet({
  children,
  title,
  description,
  triggerLabel,
  side = 'right',
  className,
  open,
  defaultOpen = false,
  onOpenChange,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;
  const isSimple = triggerLabel !== undefined;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = React.useMemo<SheetContextValue>(
    () => ({ open: isOpen, setOpen, title, description }),
    [description, isOpen, setOpen, title],
  );

  return (
    <SheetContext.Provider value={value}>
      {isSimple ? (
        <>
          <Button type="button" variant="outline" onClick={() => setOpen(true)}>
            {triggerLabel}
          </Button>
          {isOpen ? (
            <SheetContent
              side={side}
              className={className}
              title={title}
              description={description}
            >
              {children}
            </SheetContent>
          ) : null}
        </>
      ) : (
        children
      )}
    </SheetContext.Provider>
  );
}

export const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(
  ({ asChild = false, onClick, ...props }, ref) => {
    const { setOpen } = useSheet('SheetTrigger');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) setOpen(true);
    };

    // `asChild` lets a caller's own button keep its styling; the wrapper only
    // adds the open behaviour.
    if (asChild) {
      return <Slot ref={ref} {...props} onClick={handleClick} />;
    }

    return <button ref={ref} type="button" {...props} onClick={handleClick} />;
  },
);
SheetTrigger.displayName = 'SheetTrigger';

export const SheetClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useSheet('SheetClose');
    return (
      <button
        ref={ref}
        type="button"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setOpen(false);
        }}
        {...props}
      />
    );
  },
);
SheetClose.displayName = 'SheetClose';

export const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { open, setOpen } = useSheet('SheetOverlay');
    if (!open) return null;
    return (
      <div
        ref={ref}
        aria-hidden="true"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setOpen(false);
        }}
        className={cn('fixed inset-0 z-50 bg-black/50', className)}
        {...props}
      />
    );
  },
);
SheetOverlay.displayName = 'SheetOverlay';

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SheetSide;
  title?: string;
  description?: string;
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, title, description, ...props }, ref) => {
    const context = useSheet('SheetContent');
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const panelTitle = title ?? context.title;
    const panelDescription = description ?? context.description;
    const titleId = React.useId();
    const descriptionId = React.useId();
    const isClient = useIsClient();

    const setPanelRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Focus moves into the panel on open and back to the trigger on close, and
    // Tab is trapped in between — the same contract `ui/dialog` implements.
    // A layout effect catches the opener before the portal paints.
    React.useLayoutEffect(() => {
      if (!context.open) return;

      const previouslyFocused = document.activeElement as HTMLElement | null;
      const panel = panelRef.current;
      if (panel) {
        const first = panel.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? panel).focus();
      }

      return () => previouslyFocused?.focus?.();
    }, [context.open, isClient]);

    // Background scrolling is locked while the sheet is up, restoring whatever
    // the document already had rather than assuming it was scrollable.
    React.useEffect(() => {
      if (!context.open) return;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }, [context.open]);

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        event.preventDefault();
        context.setOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );

      // Nothing to cycle between: hold focus on the panel rather than letting
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

    if (!context.open || !isClient) return null;

    return createPortal(
      <div onKeyDown={onKeyDown}>
        <SheetOverlay />
        <div
          ref={setPanelRef}
          role="dialog"
          aria-modal="true"
          // A dialog with no accessible name is unusable with a screen reader,
          // so fall back to a generic label rather than rendering an empty one.
          aria-label={panelTitle ? undefined : (props['aria-label'] ?? 'Panel')}
          aria-labelledby={panelTitle ? titleId : undefined}
          aria-describedby={panelDescription ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(
            'fixed z-50 flex flex-col gap-5 border-border bg-background p-6 text-foreground shadow-lg focus-visible:outline-none',
            side === 'right' && 'inset-y-0 right-0 h-full w-4/5 max-w-sm border-l',
            side === 'left' && 'inset-y-0 left-0 h-full w-4/5 max-w-sm border-r',
            side === 'top' && 'inset-x-0 top-0 max-h-[80vh] w-full border-b',
            side === 'bottom' && 'inset-x-0 bottom-0 max-h-[80vh] w-full border-t',
            className,
          )}
          {...props}
        >
          {(panelTitle || panelDescription) && (
            <div className="space-y-1 pr-8">
              {panelTitle && (
                <h2 id={titleId} className="text-base font-semibold leading-none">
                  {panelTitle}
                </h2>
              )}
              {panelDescription && (
                <p id={descriptionId} className="text-sm text-muted-foreground">
                  {panelDescription}
                </p>
              )}
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          <SheetClose
            aria-label="Close"
            className="absolute right-4 top-4 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <X className="size-4" aria-hidden="true" />
          </SheetClose>
        </div>
      </div>,
      document.body,
    );
  },
);
SheetContent.displayName = 'SheetContent';

export const SheetHeader = Object.assign(
  ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
      {...props}
    />
  ),
  { displayName: 'SheetHeader' },
);

export const SheetFooter = Object.assign(
  ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn('mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  ),
  { displayName: 'SheetFooter' },
);

export const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />,
);
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />,
);
SheetDescription.displayName = 'SheetDescription';
