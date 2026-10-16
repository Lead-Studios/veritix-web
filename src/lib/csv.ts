export interface Attendee {
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
}

/**
 * Characters that make a spreadsheet treat a cell as a formula instead of text.
 * A tab or a carriage return is in the list because either can be used to smuggle
 * a formula past a check that only looks at the first byte.
 */
const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'];

/**
 * RFC 4180: quote a cell, and double any quote inside it, when it contains a
 * delimiter, quote, or newline.
 *
 * A cell that starts with a formula trigger is prefixed with a single quote
 * before that. Attendee names and ticket types are user-controlled, so a value
 * like `=HYPERLINK("http://…","click")` opens as a live formula in Excel or
 * Sheets when an organizer opens the exported attendee list.
 */
function escapeCell(value: string): string {
  let str = String(value);
  if (str.length > 0 && FORMULA_TRIGGERS.includes(str[0])) {
    str = `'${str}`;
  }
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
  eventDate: string,
): void {
  const headers = ['Name', 'Email', 'Ticket Type', 'Checked In'];
  const rows = attendees.map((a) => [
    a.name,
    a.email,
    a.ticketType,
    a.checkedIn ? 'Yes' : 'No',
  ]);

  exportRowsToCSV(
    headers,
    rows,
    `${toFileSlug(eventName)}_${eventDate}_attendees.csv`
  );
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
