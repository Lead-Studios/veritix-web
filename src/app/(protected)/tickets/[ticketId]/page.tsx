"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TicketPass, AttendeeTicket } from "@/components/tickets/TicketPass";
import { Loader } from "@/components/ui/Loader";

// Fetch ticket from API; falls back to a demo stub when the endpoint is unavailable.
async function fetchTicket(ticketId: string): Promise<AttendeeTicket> {
  try {
    const res = await fetch(`/api/tickets/${ticketId}`);
    if (res.ok) return res.json();
  } catch {
    // network unavailable — fall through to stub
  }
  // Demo stub so the UI is always renderable
  return {
    id: ticketId,
    eventName: "Demo Event",
    eventDate: "TBD",
    eventTime: "TBD",
    venue: "TBD",
    ticketType: "General Admission",
    ticketCode: ticketId,
    walletStatus: "pending",
    transferState: "none",
  };
}

export default function TicketPassPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<AttendeeTicket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTicket(ticketId)
      .then(setTicket)
      .catch(() => setError("Could not load ticket."));
  }, [ticketId]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#101428] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#101428] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101428] flex items-center justify-center px-4 py-12">
      <TicketPass
        ticket={ticket}
        onTransfer={
          ticket.transferState === "transferable"
            ? () => alert("Transfer flow coming soon.")
            : undefined
        }
      />
    </main>
  );
}
