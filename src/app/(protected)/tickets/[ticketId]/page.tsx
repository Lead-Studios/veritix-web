"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TicketPass, AttendeeTicket } from "@/components/tickets/TicketPass";
import { Loader } from "@/components/ui/Loader";
import { Breadcrumb } from "@/components/ui";
import { StellarExplorerLink } from "@/components/stellar/StellarExplorerLink";

// Extended ticket type that includes optional Stellar tx hash
type AttendeeTicketExtended = AttendeeTicket & {
  stellarTxHash?: string;
  stellarNetwork?: "testnet" | "mainnet";
};

// Fetch ticket from API; falls back to a demo stub when the endpoint is unavailable.
async function fetchTicket(ticketId: string): Promise<AttendeeTicketExtended> {
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
  const [ticket, setTicket] = useState<AttendeeTicketExtended | null>(null);
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

  const network =
    ticket.stellarNetwork ??
    (process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? "mainnet" : "testnet");

  return (
    <main className="min-h-screen bg-[#101428] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Breadcrumb
          className="mb-6 text-white/70"
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Tickets", href: "/tickets" },
            { label: ticket.eventName },
          ]}
        />
        <TicketPass
          ticket={ticket}
          onTransfer={
            ticket.transferState === "transferable"
              ? () => alert("Transfer flow coming soon.")
              : undefined
          }
        />

        {/* On-chain proof: show Stellar explorer link if the ticket has a tx hash */}
        {ticket.stellarTxHash && (
          <div className="mt-4 rounded-xl border border-[#4D21FF]/30 bg-[#000625]/60 px-4 py-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#21D4FF]">
              On-chain issuance
            </p>
            <StellarExplorerLink txHash={ticket.stellarTxHash} network={network} />
          </div>
        )}
      </div>
    </main>
  );
}
