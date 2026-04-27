// FE-054: Sold-out and low-stock inventory state helpers for event cards

export type InventoryStatus = "available" | "low-stock" | "sold-out";

export function getInventoryStatus(sold: number, total: number): InventoryStatus {
  if (sold >= total) return "sold-out";
  if (sold / total >= 0.9) return "low-stock";
  return "available";
}

export function getInventoryLabel(status: InventoryStatus): string {
  switch (status) {
    case "sold-out":  return "Sold Out";
    case "low-stock": return "Almost Gone";
    default:          return "Available";
  }
}

export function isPurchasable(status: InventoryStatus): boolean {
  return status === "available" || status === "low-stock";
}