// FE-088: Protected tickets area - initial ticket list types and fetch helper

export interface UserTicket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  ticketType: string;
  seatOrReference: string;
  status: "active" | "used" | "cancelled" | "expired";
  qrCode: string;
}

export async function fetchMyTickets(): Promise<UserTicket[]> {
  const res = await fetch("/api/tickets/me");
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export function groupTicketsByStatus(tickets: UserTicket[]) {
  return tickets.reduce<Record<UserTicket["status"], UserTicket[]>>(
    (acc, ticket) => {
      acc[ticket.status].push(ticket);
      return acc;
    },
    { active: [], used: [], cancelled: [], expired: [] }
  );
}