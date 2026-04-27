// FE-097: Attendee and order management utilities for manage-event screen

export interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  orderId: string;
  checkedIn: boolean;
  purchasedAt: string;
}

export async function fetchEventAttendees(eventId: string): Promise<Attendee[]> {
  const res = await fetch(`/api/events/${eventId}/attendees`);
  if (!res.ok) throw new Error("Failed to fetch attendees");
  return res.json();
}

export function exportAttendeesCSV(attendees: Attendee[]): void {
  const headers = ["Name", "Email", "Ticket Type", "Order ID", "Checked In", "Purchased At"];
  const rows = attendees.map((a) => [
    a.name, a.email, a.ticketType, a.orderId, String(a.checkedIn), a.purchasedAt,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendees-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}