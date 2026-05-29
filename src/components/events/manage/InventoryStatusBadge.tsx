import {
  getInventoryLabel,
  getInventoryStatus,
  type InventoryStatus,
} from "@/lib/inventoryStatus";

interface InventoryStatusBadgeProps {
  sold: number;
  total: number;
  className?: string;
}

const STATUS_STYLES: Record<InventoryStatus, string> = {
  available:
    "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40",
  "low-stock":
    "bg-amber-500/15 text-amber-300 border border-amber-400/40",
  "sold-out":
    "bg-red-500/15 text-red-300 border border-red-400/40",
};

const DOT_STYLES: Record<InventoryStatus, string> = {
  available: "bg-emerald-400",
  "low-stock": "bg-amber-400",
  "sold-out": "bg-red-400",
};

export function InventoryStatusBadge({
  sold,
  total,
  className = "",
}: InventoryStatusBadgeProps) {
  const status = getInventoryStatus(sold, total);
  const label = getInventoryLabel(status);
  return (
    <span
      role="status"
      aria-label={`Inventory status: ${label}`}
      data-status={status}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]} ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`}
      />
      {label}
    </span>
  );
}
