'use client';

import { useState } from 'react';

interface Props {
  pricePerTicket: number;
  maxPerOrder?: number;
  onQuantityChange?: (qty: number) => void;
}

export default function TicketQuantitySelector({ pricePerTicket, maxPerOrder = 10, onQuantityChange }: Props) {
  const [qty, setQty] = useState(1);

  const updateQty = (newQty: number) => {
    const valid = Math.max(1, Math.min(maxPerOrder, newQty));
    setQty(valid);
    if (onQuantityChange) onQuantityChange(valid);
  };

  const totalPrice = qty * pricePerTicket;

  return (
    <div className="space-y-3 p-4 rounded-xl border border-white/10 bg-[#101428]">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">Select Quantity</span>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-1">
          <button
            onClick={() => updateQty(qty - 1)}
            disabled={qty <= 1}
            className="px-2.5 py-1 text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 rounded"
          >
            -
          </button>
          <span className="text-sm font-bold text-white px-2">{qty}</span>
          <button
            onClick={() => updateQty(qty + 1)}
            disabled={qty >= maxPerOrder}
            className="px-2.5 py-1 text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 rounded"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center border-t border-white/10 pt-3">
        <span className="text-xs text-gray-400">Total Price</span>
        <span className="text-lg font-bold text-[#6B8CFF]">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
