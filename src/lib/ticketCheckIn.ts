export interface CheckInRecord {
  ticketCode: string;
  checkedInAt: string;
  deviceId: string;
}

/**
 * Marks a ticket as checked-in via the backend.
 * Replaces the in-memory Set so state persists across refreshes
 * and is shared across concurrent scanner devices.
 */
export async function markTicketUsed(ticketCode: string): Promise<void> {
  const res = await fetch("/api/tickets/check-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketCode }),
  });
  if (!res.ok) throw new Error("Failed to record check-in. Please try again.");
}

/**
 * Checks whether a ticket has already been used via the backend.
 */
export async function isTicketUsed(ticketCode: string): Promise<boolean> {
  const res = await fetch(`/api/tickets/${encodeURIComponent(ticketCode)}/status`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.checkedIn === true;
}