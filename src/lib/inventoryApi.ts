// Ticket-type inventory fetcher used by the event-management view.
// Returns live sold/total counts so the UI can compute an InventoryStatus
// (Available / Almost Gone / Sold Out) for each ticket type.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export interface TicketTypeInventory {
  id: string;
  name: string;
  price?: string;
  sold: number;
  total: number;
}

// Mock data used when no API base URL is configured (dev/preview).
const MOCK_INVENTORY: Record<string, TicketTypeInventory[]> = {
  "1": [
    { id: "t1", name: "Early Bird",        price: "$45",  sold: 200, total: 200 },
    { id: "t2", name: "General Admission", price: "$75",  sold: 110, total: 250 },
    { id: "t3", name: "VIP Pass",          price: "$180", sold: 32,  total: 50  },
  ],
  "2": [
    { id: "t1", name: "Standard",  price: "$120", sold: 156, total: 200 },
    { id: "t2", name: "Workshop",  price: "$80",  sold: 90,  total: 100 },
  ],
  "3": [
    { id: "t1", name: "Day Pass",     price: "$25", sold: 60, total: 200 },
    { id: "t2", name: "Weekend Pass", price: "$60", sold: 20, total: 100 },
  ],
  "4": [
    { id: "t1", name: "General", price: "$90", sold: 600, total: 600 },
  ],
  "5": [
    { id: "t1", name: "Founders Tier", price: "$300", sold: 0, total: 200 },
    { id: "t2", name: "Builders Tier", price: "$150", sold: 0, total: 200 },
  ],
};

export async function fetchEventInventory(
  eventId: string,
  options: { signal?: AbortSignal } = {},
): Promise<TicketTypeInventory[]> {
  if (!API_BASE) {
    return MOCK_INVENTORY[eventId] ?? [];
  }
  const res = await fetch(
    `${API_BASE}/events/${encodeURIComponent(eventId)}/inventory`,
    { signal: options.signal, cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to fetch ticket inventory");
  return (await res.json()) as TicketTypeInventory[];
}
