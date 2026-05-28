import type { TicketTypeInventory } from "@/lib/inventoryApi";
import { getInventoryStatus } from "@/lib/inventoryStatus";
import { InventoryStatusBadge } from "./InventoryStatusBadge";

interface TicketTypeRowProps {
  ticket: TicketTypeInventory;
}

export function TicketTypeRow({ ticket }: TicketTypeRowProps) {
  const status = getInventoryStatus(ticket.sold, ticket.total);
  const isSoldOut = status === "sold-out";
  const remaining = Math.max(ticket.total - ticket.sold, 0);

  return (
    <li
      data-testid="ticket-type-row"
      data-status={status}
      aria-disabled={isSoldOut || undefined}
      className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#4D21FF]/30 bg-[#000625] px-5 py-4 transition-colors ${
        isSoldOut
          ? "opacity-50 grayscale"
          : "hover:border-[#4D21FF]/60"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h3 className="truncate text-base font-semibold text-white">
            {ticket.name}
          </h3>
          <InventoryStatusBadge sold={ticket.sold} total={ticket.total} />
        </div>
        {ticket.price && (
          <p className="mt-1 text-sm text-[#21D4FF]/80">{ticket.price}</p>
        )}
      </div>

      <div className="text-right text-sm">
        <p className="font-medium text-white">
          {ticket.sold} / {ticket.total} sold
        </p>
        <p className="text-xs text-[#21D4FF]/70">
          {isSoldOut ? "No tickets remaining" : `${remaining} remaining`}
        </p>
      </div>
    </li>
  );
}
