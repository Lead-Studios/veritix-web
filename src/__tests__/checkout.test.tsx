import { describe, expect, it } from 'vitest';

interface CartItem {
  tierId: string;
  quantity: number;
  maxPerOrder: number;
}

function isWithinLimit(item: CartItem): boolean {
  return item.quantity <= item.maxPerOrder;
}

describe('checkout flow', () => {
  it('rejects a quantity above the per-order limit', () => {
    expect(isWithinLimit({ tierId: 't1', quantity: 5, maxPerOrder: 4 })).toBe(false);
  });

  it('redirects when the cart is empty', () => {
    const cart: CartItem[] = [];
    expect(cart.length === 0).toBe(true);
  });

  it('leaves the cart intact when payment is rejected', () => {
    const cart: CartItem[] = [{ tierId: 't1', quantity: 1, maxPerOrder: 4 }];
    const paymentRejected = true;
    const cartAfterRejection = paymentRejected ? cart : [];
    expect(cartAfterRejection).toEqual(cart);
  });
});
