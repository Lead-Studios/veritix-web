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

/** Reduce a name to something safe to put in a download filename. */
export function toFileSlug(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "_").toLowerCase();
}

/**
 * Serialize rows and hand them to the browser as a download. Every CSV export in
 * the app goes through here so escaping and the object-URL dance stay in one
 * place — a spreadsheet that silently mangles a comma is worse than no export.
 */
export function exportRowsToCSV(headers: string[], rows: string[][], filename: string): void {
  const csv = toCSV(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
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

  exportRowsToCSV(
    headers,
    rows,
    `${toFileSlug(eventName)}_${eventDate}_attendees.csv`
  );
}
