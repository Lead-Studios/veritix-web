'use client';

import { useCallback, useRef } from 'react';

type Direction = 'horizontal' | 'vertical' | 'both';

interface UseRovingTabindexOptions {
  /** Movement axis for arrow key navigation */
  direction?: Direction;
  /** Allow wrapping from last item to first and vice-versa */
  wrap?: boolean;
}

/**
 * Implements the roving tabindex pattern for composite widgets
 * (tabs, toolbars, listboxes, radio groups).
 *
 * Only one item in the group has tabIndex=0 at a time; others have tabIndex=-1.
 * Arrow keys move focus within the group without adding extra tab stops.
 *
 * @returns containerRef – attach to the container element
 * @returns getItemProps – call for each focusable child to get its tabIndex and onKeyDown
 *
 * @example
 * const { containerRef, getItemProps } = useRovingTabindex({ direction: 'horizontal' });
 * return (
 *   <div role="tablist" ref={containerRef}>
 *     {tabs.map((tab, i) => (
 *       <button key={tab.id} role="tab" {...getItemProps(i)}>{tab.label}</button>
 *     ))}
 *   </div>
 * );
 */
export function useRovingTabindex(options: UseRovingTabindexOptions = {}) {
  const { direction = 'horizontal', wrap = true } = options;
  const containerRef = useRef<HTMLElement | null>(null);
  const currentIndexRef = useRef<number>(0);

  const getFocusableItems = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        '[tabindex], button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      ),
    ).filter((el) => !el.closest('[aria-disabled="true"]'));
  }, []);

  const moveFocus = useCallback(
    (delta: number) => {
      const items = getFocusableItems();
      if (!items.length) return;

      let next = currentIndexRef.current + delta;
      if (wrap) {
        next = ((next % items.length) + items.length) % items.length;
      } else {
        next = Math.max(0, Math.min(items.length - 1, next));
      }

      // Reset all to -1
      items.forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });

      // Set focused to 0
      items[next].setAttribute('tabindex', '0');
      items[next].focus();
      currentIndexRef.current = next;
    },
    [getFocusableItems, wrap],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      currentIndexRef.current = index;
      const isHoriz = direction === 'horizontal' || direction === 'both';
      const isVert = direction === 'vertical' || direction === 'both';

      if ((isHoriz && e.key === 'ArrowRight') || (isVert && e.key === 'ArrowDown')) {
        e.preventDefault();
        moveFocus(1);
      } else if ((isHoriz && e.key === 'ArrowLeft') || (isVert && e.key === 'ArrowUp')) {
        e.preventDefault();
        moveFocus(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        moveFocus(-Infinity);
      } else if (e.key === 'End') {
        e.preventDefault();
        moveFocus(Infinity);
      }
    },
    [direction, moveFocus],
  );

  const getItemProps = useCallback(
    (index: number) => ({
      tabIndex: index === currentIndexRef.current ? 0 : -1,
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
      onFocus: () => {
        currentIndexRef.current = index;
      },
    }),
    [handleKeyDown],
  );

  return { containerRef, getItemProps };
}
