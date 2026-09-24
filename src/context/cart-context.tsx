'use client';

import * as React from 'react';
import type { VeritixEvent } from '@/types';

/**
 * Cart state for a ticket purchase.
 *
 * A cart only ever holds one event — buying across events is not a flow we
 * support — so selecting a tier for a different event replaces the cart. State
 * is mirrored into `sessionStorage` so a reload (or a hop to the event page and
 * back) does not lose the selection, and is dropped when the tab closes.
 */

export interface CartLine {
  tierId: string;
  quantity: number;
}

export interface CartState {
  event: VeritixEvent | null;
  lines: CartLine[];
}

export interface CartContextValue extends CartState {
  /** Add a tier, or bump its quantity if it is already in the cart. */
  addItem: (event: VeritixEvent, tierId: string, quantity: number) => void;
  updateQuantity: (tierId: string, quantity: number) => void;
  removeItem: (tierId: string) => void;
  clear: () => void;
  /** Sum of every line, in integer minor units. */
  totalMinor: number;
  /** Total number of tickets selected. */
  itemCount: number;
  currency: string;
}

const STORAGE_KEY = 'veritix.cart';

const EMPTY_CART: CartState = { event: null, lines: [] };

export const CartContext = React.createContext<CartContextValue | null>(null);

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.trunc(quantity));
}

/**
 * Best-effort read. `sessionStorage` throws in private modes and is absent
 * during SSR, so a failure has to degrade to an empty cart rather than break
 * the render.
 */
function readStoredCart(): CartState {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;

    const parsed = JSON.parse(raw) as Partial<CartState> | null;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.event ||
      !Array.isArray(parsed.lines)
    ) {
      return EMPTY_CART;
    }

    const lines = parsed.lines
      .filter(
        (line): line is CartLine =>
          Boolean(line) &&
          typeof line.tierId === 'string' &&
          typeof line.quantity === 'number',
      )
      .map((line) => ({
        tierId: line.tierId,
        quantity: normalizeQuantity(line.quantity),
      }));

    return { event: parsed.event, lines };
  } catch {
    return EMPTY_CART;
  }
}

function writeStoredCart(state: CartState): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or private-mode failures must never block a purchase.
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartState>(EMPTY_CART);

  // Restore after mount so the server and the first client render agree.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setCart(readStoredCart()), []);

  /** Update state and the stored copy together, so they cannot drift. */
  const update = React.useCallback(
    (getNext: (current: CartState) => CartState) => {
      setCart((current) => {
        const next = getNext(current);
        writeStoredCart(next);
        return next;
      });
    },
    [],
  );

  const addItem = React.useCallback(
    (event: VeritixEvent, tierId: string, quantity: number) => {
      update((current) => {
        // Switching events starts a fresh cart.
        const lines = current.event?.id === event.id ? current.lines : [];
        const existing = lines.find((line) => line.tierId === tierId);

        return {
          event,
          lines: existing
            ? lines.map((line) =>
                line.tierId === tierId
                  ? { ...line, quantity: line.quantity + normalizeQuantity(quantity) }
                  : line,
              )
            : [...lines, { tierId, quantity: normalizeQuantity(quantity) }],
        };
      });
    },
    [update],
  );

  const updateQuantity = React.useCallback(
    (tierId: string, quantity: number) => {
      update((current) => {
        const lines = current.lines.map((line) =>
          line.tierId === tierId
            ? { ...line, quantity: normalizeQuantity(quantity) }
            : line,
        );

        return { ...current, lines };
      });
    },
    [update],
  );

  const removeItem = React.useCallback(
    (tierId: string) => {
      update((current) => {
        const lines = current.lines.filter((line) => line.tierId !== tierId);
        // Removing the last ticket empties the cart entirely.
        return lines.length === 0 ? EMPTY_CART : { ...current, lines };
      });
    },
    [update],
  );

  const clear = React.useCallback(() => update(() => EMPTY_CART), [update]);

  const value = React.useMemo<CartContextValue>(() => {
    const tiers = cart.event?.tiers ?? [];

    let totalMinor = 0;
    let itemCount = 0;

    for (const line of cart.lines) {
      const tier = tiers.find((candidate) => candidate.id === line.tierId);
      if (!tier) continue;
      totalMinor += tier.priceMinor * line.quantity;
      itemCount += line.quantity;
    }

    return {
      ...cart,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      totalMinor,
      itemCount,
      currency: tiers[0]?.currency ?? 'USD',
    };
  }, [cart, addItem, updateQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = React.useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside a <CartProvider>');
  }

  return context;
}
