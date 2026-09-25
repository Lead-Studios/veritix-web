'use client';

import * as React from 'react';

export const MAX_QUANTITY_PER_TIER_PER_ORDER = 4;

interface CartItem {
  tierId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (tierId: string, quantity: number) => { ok: boolean; message?: string };
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  const addItem = (tierId: string, quantity: number) => {
    if (quantity > MAX_QUANTITY_PER_TIER_PER_ORDER) {
      return { ok: false, message: `Limit is ${MAX_QUANTITY_PER_TIER_PER_ORDER} per order` };
    }
    setItems((prev) => [...prev, { tierId, quantity }]);
    return { ok: true };
  };

  return <CartContext.Provider value={{ items, addItem }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
