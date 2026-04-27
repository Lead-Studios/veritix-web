// FE-098: Manage-event analytics types and fetch helper

export interface EventAnalytics {
  totalSold: number;
  totalCapacity: number;
  revenue: number;
  checkIns: number;
  ticketMix: { type: string; sold: number; total: number }[];
  salesByDay: { date: string; count: number }[];
}

export async function fetchEventAnalytics(eventId: string): Promise<EventAnalytics> {
  const res = await fetch(`/api/events/${eventId}/analytics`);
  if (!res.ok) throw new Error("Failed to fetch event analytics");
  return res.json();
}

export function getSalesVelocity(salesByDay: EventAnalytics["salesByDay"]): number {
  if (salesByDay.length === 0) return 0;
  const total = salesByDay.reduce((sum, d) => sum + d.count, 0);
  return Math.round(total / salesByDay.length);
}