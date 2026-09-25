'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/** Enabled tabs, in DOM order. Disabled tabs are skipped by every key. */
const TABS = '[role="tab"]:not([aria-disabled="true"])';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error(`<${component}> must be rendered inside <Tabs>`);
  }
  return context;
}

/** Tab and panel ids are derived, so triggers and panels can wire to each other. */
const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled selection. Omit to let Tabs manage its own. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Tabs following the ARIA tabs pattern, used by the dashboard and event detail
 * pages.
 *
 * Selection follows focus: moving with the arrow keys selects as it goes, which
 * is the pattern's default for cheap panels and means one key press rather than
 * two. Only the selected panel is rendered, so inactive panel content is never
 * in the tab order or read by a screen reader.
 */
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
    const baseId = React.useId();

    const isControlled = value !== undefined;
    const current = isControlled ? value : uncontrolledValue;

    const setValue = React.useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const context = React.useMemo<TabsContextValue>(
      () => ({ value: current, setValue, baseId, orientation }),
      [current, setValue, baseId, orientation],
    );

    return (
      <TabsContext.Provider value={context}>
        <div
          ref={ref}
          data-orientation={orientation}
          className={cn(orientation === 'vertical' && 'flex gap-4', className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = 'Tabs';

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, onKeyDown, ...props }, forwardedRef) => {
    const { orientation } = useTabsContext('TabsList');
    const listRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const tabs = Array.from(listRef.current?.querySelectorAll<HTMLElement>(TABS) ?? []);
      if (tabs.length === 0) return;

      const currentIndex = tabs.indexOf(document.activeElement as HTMLElement);
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      const previousKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

      let target: number | null = null;
      if (event.key === nextKey) target = currentIndex + 1;
      else if (event.key === previousKey) target = currentIndex - 1;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabs.length - 1;

      if (target === null) return;

      event.preventDefault();
      // Wrap in both directions, so the ends are never dead keys.
      const wrapped = ((target % tabs.length) + tabs.length) % tabs.length;
      tabs[wrapped]?.focus();
    };

    return (
      <div
        ref={setRefs}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex gap-1 rounded-[var(--radius)] bg-muted p-1 text-muted-foreground',
          orientation === 'vertical' ? 'flex-col' : 'items-center',
          className,
        )}
        {...props}
      />
    );
  },
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled = false, onClick, onFocus, ...props }, ref) => {
    const { value: current, setValue, baseId } = useTabsContext('TabsTrigger');
    const selected = current === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId(baseId, value)}
        aria-selected={selected}
        aria-controls={panelId(baseId, value)}
        aria-disabled={disabled || undefined}
        // Roving tabindex: one stop for the whole tablist, so Tab moves past the
        // tabs to the panel rather than through every tab.
        tabIndex={selected ? 0 : -1}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !disabled) setValue(value);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          // Selection follows focus, which is what makes arrow keys sufficient.
          if (!disabled) setValue(value);
        }}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'aria-disabled:pointer-events-none aria-disabled:opacity-50',
          selected ? 'bg-background text-foreground shadow-sm' : 'hover:text-foreground',
          className,
        )}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: current, baseId } = useTabsContext('TabsContent');

    // Unmounting rather than hiding keeps inactive content out of the tab order
    // and out of the accessibility tree entirely.
    if (current !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId(baseId, value)}
        aria-labelledby={tabId(baseId, value)}
        // The panel itself is focusable so keyboard users land on the content
        // after leaving the tablist, even when it holds nothing focusable.
        tabIndex={0}
        className={cn(
          'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          className,
        )}
        {...props}
      />
    );
  },
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
