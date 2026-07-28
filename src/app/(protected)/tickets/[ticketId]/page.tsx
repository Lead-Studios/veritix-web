"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TicketPass, AttendeeTicket } from "@/components/tickets/TicketPass";
import { TransferHistory } from "@/components/tickets/TransferHistory";
import { Loader } from "@/components/ui/Loader";
import { Breadcrumb } from "@/components/ui";
import { PostEventReviewModal } from "@/features/tickets/components/PostEventReviewModal";
import { Star } from "lucide-react";

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

function getStoredRating(eventId: string): number | null {
  try {
    const val = localStorage.getItem(`reviewed_event_${eventId}`);
    return val ? Number(val) : null;
  } catch {
    return null;
  }
}

export default function TicketPassPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<AttendeeTicketExtended | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewedRating, setReviewedRating] = useState<number | null>(null);

  useEffect(() => {
    fetchTicket(ticketId)
      .then((t) => {
        setTicket(t);
        // Check if already reviewed (persisted in localStorage)
        const stored = getStoredRating(t.id);
        if (stored) setReviewedRating(stored);
      })
      .catch(() => setError("Could not load ticket."));
  }, [ticketId]);

  // Determine if the "Leave a Review" button should be shown:
  // event date has passed AND ticket was issued AND not yet reviewed
  const canReview = (() => {
    if (!ticket || reviewedRating) return false;
    if ((ticket as AttendeeTicket & { status?: string }).status !== undefined &&
        (ticket as AttendeeTicket & { status?: string }).status !== "ISSUED") return false;
    if (!ticket.eventDate || ticket.eventDate === "TBD") return false;
    const eventDate = new Date(ticket.eventDate);
    return !isNaN(eventDate.getTime()) && eventDate < new Date();
  })();

  const handleReviewSuccess = (rating: number) => {
    setReviewedRating(rating);
    setShowReviewModal(false);
  };

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
        <div className="mt-4">
          <TransferHistory ticketId={ticketId} />
        </div>
      </div>

      {showReviewModal && (
        <PostEventReviewModal
          eventId={ticket.id}
          eventName={ticket.eventName}
          onClose={() => setShowReviewModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </main>
  );
}
