import type { VeritixEvent } from '@/types';

function toIcsDate(iso: string): string {
  return iso.replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/** Builds an .ics file body for adding an event to a calendar app. */
export function buildIcsFile(event: VeritixEvent): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}, ${event.city}`,
    `DTSTART:${toIcsDate(event.startsAt)}`,
    `DTEND:${toIcsDate(event.endsAt)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function googleCalendarUrl(event: VeritixEvent): string {
  const dates = `${toIcsDate(event.startsAt)}/${toIcsDate(event.endsAt)}`;
  const params = new URLSearchParams({ action: 'TEMPLATE', text: event.title, dates, location: `${event.venue}, ${event.city}` });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
