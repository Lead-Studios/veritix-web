// FE-097: Attendee and order management utilities for manage-event screen

export interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  orderId: string;
  checkedIn: boolean;
  purchasedAt: string;
  banned?: boolean;
  banReason?: string;
}

interface ApiAttendee {
  id: string;
  name: string;
  email: string;
  ticket_type: string;
  order_id: string;
  checked_in: boolean;
  purchased_at: string;
  banned?: boolean;
  ban_reason?: string;
}

export async function fetchEventAttendees(eventId: string): Promise<Attendee[]> {
  const res = await fetch(`/api/admin/events/${eventId}/attendees`);
  if (!res.ok) throw new Error("Failed to fetch attendees");
  const data = await res.json();
  // FIXME: The API returns a mix of snake_case and camelCase, this should be fixed
  return (data.attendees as ApiAttendee[]).map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    ticketType: a.ticket_type,
    orderId: a.order_id,
    checkedIn: a.checked_in,
    purchasedAt: a.purchased_at,
    banned: a.banned,
    banReason: a.ban_reason,
  }));
}

export async function checkInAttendee(
  eventId: string,
  attendeeId: string,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/events/${eventId}/attendees/${attendeeId}/check-in`, {
    method: "POST",
  });
  if (!res.ok) return { success: false, message: "Check-in failed. Please try again." };
  return { success: true, message: "Attendee checked in." };
}

export async function banAttendee(
  eventId: string,
  attendeeId: string,
  reason: string,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/admin/events/${eventId}/ban`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attendeeId, reason }),
  });
  if (!res.ok) return { success: false, message: "Banning failed. Please try again." };
  return { success: true, message: "Attendee banned." };
}

export function exportAttendeesCSV(attendees: Attendee[], eventId = "event"): void {
  const headers = [
    "Name",
    "Email",
    "Ticket Type",
    "Order ID",
    "Checked In",
    "Purchased At",
    "Banned",
    "Ban Reason",
  ];
  const rows = attendees.map((a) => [
    a.name,
    a.email,
    a.ticketType,
    a.orderId,
    String(a.checkedIn),
    a.purchasedAt,
    String(a.banned ?? false),
    a.banReason ?? "",
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendees-${eventId}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
