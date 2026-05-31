import { describe, it, expect } from "vitest";
import {
  groupTicketsByStatus,
  resolveStatusLabel,
  formatTicketPrice,
  UserTicket,
} from "../lib/ticketHelpers";
import {
  validateTicketRow,
  validateAllTickets,
  validateTicketDetails,
  TicketRow,
  TicketDetails,
} from "../lib/ticketValidation";

describe("ticketHelpers", () => {
  describe("groupTicketsByStatus", () => {
    it("should group tickets by their status", () => {
      const tickets: UserTicket[] = [
        {
          id: "1",
          eventId: "e1",
          eventName: "Event 1",
          eventDate: "Date 1",
          ticketType: "VIP",
          seatOrReference: "A1",
          status: "active",
          qrCode: "qr1",
        },
        {
          id: "2",
          eventId: "e2",
          eventName: "Event 2",
          eventDate: "Date 2",
          ticketType: "Regular",
          seatOrReference: "B1",
          status: "used",
          qrCode: "qr2",
        },
        {
          id: "3",
          eventId: "e3",
          eventName: "Event 3",
          eventDate: "Date 3",
          ticketType: "Regular",
          seatOrReference: "C1",
          status: "active",
          qrCode: "qr3",
        },
      ];

      const grouped = groupTicketsByStatus(tickets);
      expect(grouped.active).toHaveLength(2);
      expect(grouped.used).toHaveLength(1);
      expect(grouped.cancelled).toHaveLength(0);
      expect(grouped.expired).toHaveLength(0);
    });
  });

  describe("resolveStatusLabel", () => {
    it("should resolve active status correctly", () => {
      expect(resolveStatusLabel("active")).toBe("Active");
    });
    it("should resolve used status correctly", () => {
      expect(resolveStatusLabel("used")).toBe("Used");
    });
    it("should resolve cancelled status correctly", () => {
      expect(resolveStatusLabel("cancelled")).toBe("Cancelled");
    });
    it("should resolve expired status correctly", () => {
      expect(resolveStatusLabel("expired")).toBe("Expired");
    });
  });

  describe("formatTicketPrice", () => {
    it("should format 0 as Free", () => {
      expect(formatTicketPrice(0)).toBe("Free");
    });
    it("should format non-zero price as ETH with 2 decimal places", () => {
      expect(formatTicketPrice(0.08)).toBe("0.08 ETH");
      expect(formatTicketPrice(1.5)).toBe("1.50 ETH");
    });
  });
});

describe("ticketValidation", () => {
  describe("validateTicketRow", () => {
    it("should return no errors for a valid ticket row", () => {
      const ticket: TicketRow = { name: "General Admission", quantity: 10, price: 5 };
      const errors = validateTicketRow(ticket);
      expect(errors).toHaveLength(0);
    });

    it("should flag empty ticket names", () => {
      const ticket: TicketRow = { name: "   ", quantity: 10, price: 5 };
      const errors = validateTicketRow(ticket);
      expect(errors).toContainEqual({ field: "name", message: "Ticket name is required." });
    });

    it("should flag invalid quantities", () => {
      const ticket1: TicketRow = { name: "VIP", quantity: 0, price: 5 };
      const ticket2: TicketRow = { name: "VIP", quantity: -2.5, price: 5 };
      expect(validateTicketRow(ticket1)).toContainEqual({ field: "quantity", message: "Quantity must be at least 1." });
      expect(validateTicketRow(ticket2)).toContainEqual({ field: "quantity", message: "Quantity must be at least 1." });
    });

    it("should flag negative prices", () => {
      const ticket: TicketRow = { name: "VIP", quantity: 5, price: -1 };
      const errors = validateTicketRow(ticket);
      expect(errors).toContainEqual({ field: "price", message: "Price cannot be negative." });
    });
  });

  describe("validateAllTickets", () => {
    it("should return index mapped validation errors", () => {
      const tickets: TicketRow[] = [
        { name: "Valid", quantity: 10, price: 5 },
        { name: "", quantity: -1, price: 5 },
      ];
      const result = validateAllTickets(tickets);
      expect(result.has(0)).toBe(false);
      expect(result.has(1)).toBe(true);
      expect(result.get(1)).toHaveLength(2);
    });
  });

  describe("validateTicketDetails (expiration and limit validations)", () => {
    it("should return no errors for a valid ticket detail check", () => {
      const ticket: TicketDetails = {
        id: "t1",
        name: "VIP",
        price: 10,
        quantityLimit: 100,
        quantitySold: 50,
        expirationDate: new Date(Date.now() + 86400000).toISOString(),
      };
      const errors = validateTicketDetails(ticket, 5);
      expect(errors).toHaveLength(0);
    });

    it("should flag expired tickets", () => {
      const ticket: TicketDetails = {
        id: "t1",
        name: "VIP",
        price: 10,
        quantityLimit: 100,
        quantitySold: 50,
        expirationDate: new Date(Date.now() - 86400000).toISOString(),
      };
      const errors = validateTicketDetails(ticket, 5);
      expect(errors).toContain("Ticket has expired.");
    });

    it("should flag limit exceed cases", () => {
      const ticket: TicketDetails = {
        id: "t1",
        name: "VIP",
        price: 10,
        quantityLimit: 100,
        quantitySold: 95,
      };
      const errors = validateTicketDetails(ticket, 10);
      expect(errors).toContain("Purchase quantity exceeds available ticket limit.");
    });

    it("should flag invalid purchase quantities", () => {
      const ticket: TicketDetails = {
        id: "t1",
        name: "VIP",
        price: 10,
        quantityLimit: 100,
        quantitySold: 50,
      };
      const errors = validateTicketDetails(ticket, 0);
      expect(errors).toContain("Purchase quantity must be at least 1.");
    });
  });
});
