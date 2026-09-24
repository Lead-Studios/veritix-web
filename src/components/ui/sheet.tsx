'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type SheetContextValue = { open: boolean; setOpen: (open: boolean) => void };
const SheetContext = React.createContext<SheetContextValue | null>(null);
const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error('Sheet components must be used inside Sheet');
  return context;
};

const Sheet = ({ open, defaultOpen = false, onOpenChange, children }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;
  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return <SheetContext.Provider value={{ open: isOpen, setOpen }}>{children}</SheetContext.Provider>;
};

const SheetTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useSheet();
    return <button ref={ref} type="button" onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) setOpen(true); }} {...props} />;
  },
);
SheetTrigger.displayName = 'SheetTrigger';

const SheetClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useSheet();
    return <button ref={ref} type="button" onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) setOpen(false); }} {...props} />;
  },
);
SheetClose.displayName = 'SheetClose';

const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { open, setOpen } = useSheet();
  if (!open) return null;
  return <div ref={ref} aria-hidden="true" onClick={() => setOpen(false)} className={cn('fixed inset-0 z-50 bg-black/50', className)} {...props} />;
});
SheetOverlay.displayName = 'SheetOverlay';

type SheetSide = 'top' | 'right' | 'bottom' | 'left';
type SheetContentProps = React.HTMLAttributes<HTMLDialogElement> & { side?: SheetSide };

const SheetContent = React.forwardRef<HTMLDialogElement, SheetContentProps>(({ side = 'right', className, children, onClose, ...props }, forwardedRef) => {
  const { open, setOpen } = useSheet();
  const internalRef = React.useRef<HTMLDialogElement | null>(null);
  const setRefs = (node: HTMLDialogElement | null) => {
    internalRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  React.useEffect(() => {
    const dialog = internalRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;
  return (
    <>
      <SheetOverlay />
      <dialog
        ref={setRefs}
        aria-modal="true"
        onCancel={(event) => { event.preventDefault(); setOpen(false); }}
        onClose={(event) => { onClose?.(event); setOpen(false); }}
        className={cn(
          'fixed z-50 m-0 flex w-full max-w-none flex-col gap-4 border border-border bg-background p-6 text-foreground shadow-lg outline-none',
          side === 'right' && 'inset-y-0 right-0 h-full sm:max-w-sm',
          side === 'left' && 'inset-y-0 left-0 h-full sm:max-w-sm',
          side === 'top' && 'inset-x-0 top-0 max-h-[80vh]',
          side === 'bottom' && 'inset-x-0 bottom-0 max-h-[80vh]',
          className,
        )}
        {...props}
      >
        {children}
        <SheetClose aria-label="Close" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <X className="size-4" aria-hidden="true" />
        </SheetClose>
      </dialog>
    </>
  );
});
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />;
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />;
const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />);
const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />);

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetOverlay };