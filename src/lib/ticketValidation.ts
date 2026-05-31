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

export interface TicketDetails {
  id: string;
  name: string;
  price: number;
  quantityLimit: number;
  quantitySold: number;
  expirationDate?: string;
}

export function validateTicketDetails(ticket: TicketDetails, purchaseQuantity: number): string[] {
  const errors: string[] = [];
  
  if (purchaseQuantity < 1) {
    errors.push("Purchase quantity must be at least 1.");
  }
  
  if (ticket.expirationDate) {
    const expDate = new Date(ticket.expirationDate);
    if (!isNaN(expDate.getTime()) && expDate.getTime() < Date.now()) {
      errors.push("Ticket has expired.");
    }
  }
  
  if (ticket.quantitySold + purchaseQuantity > ticket.quantityLimit) {
    errors.push("Purchase quantity exceeds available ticket limit.");
  }
  
  return errors;
}