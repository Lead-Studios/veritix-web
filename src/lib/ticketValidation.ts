// FE-076: Ticket row validation for event creation

export interface TicketRow {
  name: string;
  quantity: number;
  price: number;
}

export interface TicketValidationError {
  field: "name" | "quantity" | "price";
  message: string;
}

export function validateTicketRow(ticket: TicketRow): TicketValidationError[] {
  const errors: TicketValidationError[] = [];
  if (!ticket.name.trim()) {
    errors.push({ field: "name", message: "Ticket name is required." });
  }
  if (!Number.isInteger(ticket.quantity) || ticket.quantity < 1) {
    errors.push({ field: "quantity", message: "Quantity must be at least 1." });
  }
  if (ticket.price < 0) {
    errors.push({ field: "price", message: "Price cannot be negative." });
  }
  return errors;
}

export function validateAllTickets(tickets: TicketRow[]): Map<number, TicketValidationError[]> {
  const result = new Map<number, TicketValidationError[]>();
  tickets.forEach((ticket, index) => {
    const errors = validateTicketRow(ticket);
    if (errors.length > 0) result.set(index, errors);
  });
  return result;
}