'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/** Enabled menu items, in DOM order. Disabled items are skipped by every key. */
const MENU_ITEMS = '[role="menuitem"]:not([aria-disabled="true"])';

/** How long typed characters accumulate before typeahead starts a new search. */
const TYPEAHEAD_RESET_MS = 500;

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuId: string;
  triggerId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  /** Focus returns to the trigger whenever the menu closes from inside. */
  closeAndRefocus: () => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(component: string): DropdownMenuContextValue {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(`<${component}> must be rendered inside <DropdownMenu>`);
  }
  return context;
}

export interface DropdownMenuProps {
  children: React.ReactNode;
  /** Controlled open state. Omit to let the menu manage its own. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

/**
 * Menu following the ARIA menu button pattern.
 *
 * A div-based menu is unreachable by keyboard, so the behaviour here is the
 * point: arrow keys move between items, Home/End jump to the ends, typing
 * jumps to a matching item, Escape closes and hands focus back to the trigger.
 * Items are never in the page tab order — focus is managed inside the menu, so
 * Tab leaves the menu rather than walking through it.
 */
function DropdownMenu({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuId = React.useId();
  const triggerId = React.useId();

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const closeAndRefocus = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  const value = React.useMemo<DropdownMenuContextValue>(
    () => ({ open: isOpen, setOpen, menuId, triggerId, triggerRef, closeAndRefocus }),
    [isOpen, setOpen, menuId, triggerId, closeAndRefocus],
  );

  return (
    <DropdownMenuContext.Provider value={value}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export type DropdownMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className, onClick, onKeyDown, ...props }, forwardedRef) => {
    const { open, setOpen, menuId, triggerId, triggerRef } =
      useDropdownMenuContext('DropdownMenuTrigger');

    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef, triggerRef],
    );

    return (
      <button
        ref={setRefs}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setOpen(!open);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          // Arrow keys open the menu, matching the ARIA pattern, so the menu is
          // reachable without a pointer.
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors',
          'hover:bg-secondary hover:text-secondary-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          className,
        )}
        {...props}
      />
    );
  },
);
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which end of the menu receives focus when it opens. */
  autoFocusItem?: 'first' | 'last';
  align?: 'start' | 'end';
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (
    {
      className,
      children,
      autoFocusItem = 'first',
      align = 'start',
      onKeyDown,
      ...props
    },
    forwardedRef,
  ) => {
    const { open, menuId, triggerId, closeAndRefocus, setOpen, triggerRef } =
      useDropdownMenuContext('DropdownMenuContent');
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const typeaheadRef = React.useRef({ query: '', at: 0 });

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        menuRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const items = React.useCallback(
      () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>(MENU_ITEMS) ?? []),
      [],
    );

    const focusItemAt = React.useCallback(
      (index: number) => {
        const all = items();
        if (all.length === 0) return;
        // Wrap in both directions so ArrowDown past the end returns to the top.
        const wrapped = ((index % all.length) + all.length) % all.length;
        all[wrapped]?.focus();
      },
      [items],
    );

    React.useEffect(() => {
      if (!open) return;
      const all = items();
      if (all.length === 0) {
        menuRef.current?.focus();
        return;
      }
      (autoFocusItem === 'last' ? all[all.length - 1] : all[0]).focus();
    }, [open, autoFocusItem, items]);

    // A click anywhere else dismisses the menu. Unlike Escape this leaves focus
    // where the user put it rather than yanking it back to the trigger.
    React.useEffect(() => {
      if (!open) return;

      const onPointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (menuRef.current?.contains(target)) return;
        if (triggerRef.current?.contains(target)) return;
        setOpen(false);
      };

      document.addEventListener('mousedown', onPointerDown);
      return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const all = items();
      const currentIndex = all.indexOf(document.activeElement as HTMLElement);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusItemAt(currentIndex + 1);
          return;
        case 'ArrowUp':
          event.preventDefault();
          focusItemAt(currentIndex - 1);
          return;
        case 'Home':
          event.preventDefault();
          focusItemAt(0);
          return;
        case 'End':
          event.preventDefault();
          focusItemAt(all.length - 1);
          return;
        case 'Escape':
          event.preventDefault();
          closeAndRefocus();
          return;
        case 'Tab':
          // Tab is not a menu key: dismiss and let focus continue past the menu.
          setOpen(false);
          return;
        default:
          break;
      }

      // Typeahead: printable single characters jump to the next matching item.
      if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey)
        return;

      event.preventDefault();
      const now = Date.now();
      const state = typeaheadRef.current;
      state.query =
        now - state.at > TYPEAHEAD_RESET_MS
          ? event.key.toLowerCase()
          : state.query + event.key.toLowerCase();
      state.at = now;

      // Repeating one character cycles through the items starting with it,
      // rather than searching for a string of that character repeated. Typing
      // 'd' twice in Edit/Duplicate/Delete goes Duplicate then Delete.
      const repeated =
        state.query.length > 1 &&
        state.query.split('').every((c) => c === state.query[0]);
      const query = repeated ? state.query[0] : state.query;

      // Always search from the item after the focused one, so a repeated
      // character advances instead of re-matching where it already is.
      const startAt = currentIndex + 1;
      const ordered = [...all.slice(startAt), ...all.slice(0, startAt)];
      const match = ordered.find((item) =>
        (item.textContent ?? '').trim().toLowerCase().startsWith(query),
      );
      match?.focus();
    };

    return (
      <div
        ref={setRefs}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'absolute z-50 mt-1 min-w-[12rem] overflow-hidden rounded-[var(--radius)] border border-border bg-popover p-1 text-popover-foreground shadow-md',
          'focus-visible:outline-none',
          align === 'end' ? 'right-0' : 'left-0',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface DropdownMenuItemProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onSelect'
> {
  disabled?: boolean;
  /** Called on click, Enter and Space. The menu closes afterwards. */
  onSelect?: () => void;
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, disabled = false, onSelect, onClick, onKeyDown, ...props }, ref) => {
    const { closeAndRefocus } = useDropdownMenuContext('DropdownMenuItem');

    const select = () => {
      if (disabled) return;
      onSelect?.();
      closeAndRefocus();
    };

    return (
      <div
        ref={ref}
        role="menuitem"
        aria-disabled={disabled || undefined}
        // Focus is managed by the menu, so items stay out of the page tab order.
        tabIndex={-1}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) select();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            select();
          }
        }}
        className={cn(
          'flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
          'focus:bg-secondary focus:text-secondary-foreground',
          'aria-disabled:pointer-events-none aria-disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
