export interface Attendee {
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
}

/** RFC 4180: quote a cell, and double any quote inside it, when it contains a delimiter, quote, or newline. */
function escapeCell(value: string): string {
  const str = String(value);
  if (
    str.includes(',') ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r')
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(headers: string[], rows: string[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(','));
  return lines.join('\r\n');
}

export function exportAttendeesToCSV(
  attendees: Attendee[],
  eventName: string,
  eventDate: string,
): void {
  const headers = ['Name', 'Email', 'Ticket Type', 'Checked In'];
  const rows = attendees.map((a) => [
    a.name,
    a.email,
    a.ticketType,
    a.checkedIn ? 'Yes' : 'No',
  ]);

  const csv = toCSV(headers, rows);
  // A BOM, so Excel on Windows reads the file as UTF-8 instead of the local
  // codepage — attendee names are not ASCII.
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  link.href = url;
  link.download = `${safeName}_${eventDate}_attendees.csv`;
  link.click();
  // Give the click a tick to be dispatched before the blob goes away.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
