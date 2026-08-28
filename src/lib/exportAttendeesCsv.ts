import { buildUrl, API_ROUTES } from './api-routes';

export interface TicketRecord {
  attendeeName: string;
  attendeeEmail: string;
  ticketType: string;
  ticketCode: string;
  status: string;
  purchasedAt: string;
}

interface RawTicketRecord {
  attendeeName?: string;
  attendee_name?: string;
  attendeeEmail?: string;
  attendee_email?: string;
  ticketType?: string;
  ticket_type?: string;
  ticketCode?: string;
  ticket_code?: string;
  status?: string;
  purchasedAt?: string;
  purchased_at?: string;
}

interface TicketPage {
  total?: number;
  tickets?: RawTicketRecord[];
}

/** Fetch all tickets for an event, paginating if total > 1000. */
export async function fetchAllTickets(eventId: string): Promise<TicketRecord[]> {
  const PAGE = 1000;
  const first = await fetch(
    buildUrl(`${API_ROUTES.events.tickets(eventId)}?limit=${PAGE}&offset=0`),
  );
  if (!first.ok) throw new Error('Failed to fetch tickets');
  const firstData = (await first.json()) as TicketPage | RawTicketRecord[];
  const firstPage = Array.isArray(firstData) ? undefined : firstData;
  const total = firstPage?.total ?? firstPage?.tickets?.length ?? 0;
  const tickets = mapTickets(
    firstPage?.tickets ?? (Array.isArray(firstData) ? firstData : []),
  );

  if (total > PAGE) {
    const pages = Math.ceil(total / PAGE);
    const requests = Array.from({ length: pages - 1 }, (_, i) =>
      fetch(
        buildUrl(
          `${API_ROUTES.events.tickets(eventId)}?limit=${PAGE}&offset=${(i + 1) * PAGE}`,
        ),
      )
        .then((r) => r.json() as Promise<TicketPage | RawTicketRecord[]>)
        .then((data) => {
          const page = Array.isArray(data) ? undefined : data;
          return mapTickets(page?.tickets ?? (Array.isArray(data) ? data : []));
        }),
    );
    const rest = await Promise.all(requests);
    rest.forEach((batch) => tickets.push(...batch));
  }

  return tickets;
}

function mapTickets(raw: RawTicketRecord[]): TicketRecord[] {
  return raw.map((t) => ({
    attendeeName: t.attendeeName ?? t.attendee_name ?? '',
    attendeeEmail: t.attendeeEmail ?? t.attendee_email ?? '',
    ticketType: t.ticketType ?? t.ticket_type ?? '',
    ticketCode: t.ticketCode ?? t.ticket_code ?? '',
    status: t.status ?? '',
    purchasedAt: t.purchasedAt ?? t.purchased_at ?? '',
  }));
}

const HEADERS = [
  'attendeeName',
  'attendeeEmail',
  'ticketType',
  'ticketCode',
  'status',
  'purchasedAt',
] as const;

function escape(v: string): string {
  return v.includes(',') || v.includes('"') || v.includes('\n')
    ? `"${v.replace(/"/g, '""')}"`
    : v;
}

export function exportAttendeesCsv(tickets: TicketRecord[], eventSlug: string): void {
  const date = new Date().toISOString().slice(0, 10);
  const rows = [
    HEADERS.join(','),
    ...tickets.map((t) => HEADERS.map((h) => escape(t[h])).join(',')),
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `veritix-attendees-${eventSlug}-${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
