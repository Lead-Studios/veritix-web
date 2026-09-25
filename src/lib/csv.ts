export interface Attendee {
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
}

function escapeCell(value: string): string {
  const str = String(value);
  // Wrap in quotes if contains comma, quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(headers: string[], rows: string[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(","));
  return lines.join("\n");
}

export function exportAttendeesToCSV(
  attendees: Attendee[],
  eventName: string,
  eventDate: string
): void {
  const headers = ["Name", "Email", "Ticket Type", "Checked In"];
  const rows = attendees.map((a) => [
    a.name,
    a.email,
    a.ticketType,
    a.checkedIn ? "Yes" : "No",
  ]);

  const csv = toCSV(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  link.href = url;
  link.download = `${safeName}_${eventDate}_attendees.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
