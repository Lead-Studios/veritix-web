"use client";

export interface TicketOption {
  name: string;
  description?: string;
  benefits?: string[];
  price: number;
  remaining: number;
  popular?: boolean;
}

interface TicketSelectorProps {
  tickets: TicketOption[];
  selectedIndex: number;
  quantity: number;
  onSelect: (index: number) => void;
  onQuantityChange: (qty: number) => void;
  onPurchase: () => void;
  isSoldOut: boolean;
}

export function TicketSelector({
  tickets,
  selectedIndex,
  quantity,
  onSelect,
  onQuantityChange,
  onPurchase,
  isSoldOut,
}: TicketSelectorProps) {
  const selected = tickets[selectedIndex];
  const maxQty = selected ? Math.min(selected.remaining, 10) : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Select Tickets</h2>

      <ul className="space-y-3">
        {tickets.map((ticket, i) => {
          const soldOut = ticket.remaining === 0;
          const isActive = selectedIndex === i;
          return (
            <li key={ticket.name}>
              <button
                type="button"
                disabled={soldOut}
                onClick={() => { onSelect(i); onQuantityChange(1); }}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  isActive
                    ? "border-[#4D21FF] bg-[#4D21FF]/10"
                    : soldOut
                    ? "cursor-not-allowed border-white/10 opacity-50"
                    : "border-white/10 bg-white/5 hover:border-[#4D21FF]/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{ticket.name}</span>
                      {ticket.popular && !soldOut && (
                        <span className="rounded-full bg-[#4D21FF]/30 px-2 py-0.5 text-xs text-[#21D4FF]">
                          Popular
                        </span>
                      )}
                      {soldOut && (
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-300">
                          Sold out
                        </span>
                      )}
                    </div>
                    {ticket.description && (
                      <p className="mt-1 text-xs text-white/60">{ticket.description}</p>
                    )}
                    {ticket.benefits && ticket.benefits.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {ticket.benefits.map((b) => (
                          <li key={b} className="text-xs text-[#21D4FF]/80">
                            • {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-white">
                      {ticket.price === 0 ? "Free" : `${ticket.price} ETH`}
                    </p>
                    <p className="text-xs text-white/50">{ticket.remaining} left</p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Quantity + purchase */}
      {selected && !isSoldOut && (
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(quantity - 1)}
              className="h-6 w-6 rounded-full text-white/70 transition-colors hover:text-white disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium text-white">{quantity}</span>
            <button
              type="button"
              disabled={quantity >= maxQty}
              onClick={() => onQuantityChange(quantity + 1)}
              className="h-6 w-6 rounded-full text-white/70 transition-colors hover:text-white disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onPurchase}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Buy {quantity > 1 ? `${quantity} tickets` : "ticket"} ·{" "}
            {(selected.price * quantity).toFixed(3)} ETH
          </button>
        </div>
      )}

      {isSoldOut && (
        <div className="pt-2 text-center">
          <p className="mb-3 text-sm text-white/60">This event is sold out.</p>
          <WaitlistPlaceholder />
        </div>
      )}
    </div>
  );
}

// Lightweight placeholder — real waitlist handled by WaitlistButton in the page
function WaitlistPlaceholder() {
  return (
    <button
      type="button"
      className="w-full rounded-xl border border-[#4D21FF]/40 py-3 text-sm font-semibold text-[#21D4FF] transition-colors hover:bg-[#4D21FF]/10"
    >
      Join Waitlist
    </button>
  );
}
