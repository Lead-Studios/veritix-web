"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TicketTypeRow } from "@/components/events/manage/TicketTypeRow";
import { useEventInventory } from "@/hooks/useEventInventory";

interface ManagedEvent {
  id: string;
  name: string;
  status: string;
}

export default function ManageEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<ManagedEvent | null>(null);
  const [eventLoading, setEventLoading] = useState(true);

  const {
    data: ticketTypes,
    loading: inventoryLoading,
    error: inventoryError,
    refresh,
  } = useEventInventory(eventId);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    setEventLoading(true);
    fetch(`/api/events/${eventId}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data) => {
        if (cancelled) return;
        setEvent(
          data ?? { id: eventId, name: `Event ${eventId}`, status: "active" },
        );
      })
      .finally(() => {
        if (!cancelled) setEventLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return (
    <div className="min-h-screen bg-[#101428] py-10 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-sm">
          <Link
            href="/events/manage"
            className="text-[#21D4FF] hover:underline"
          >
            ← Back to events
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {eventLoading ? "Loading event…" : event?.name ?? "Event not found"}
            </h1>
            {event && !eventLoading && (
              <p className="mt-1 text-sm text-[#21D4FF]/80">
                Status: {event.status}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={refresh}
            className="rounded-lg border border-[#4D21FF]/40 px-4 py-2 text-sm font-medium text-[#21D4FF] transition-colors hover:bg-[#4D21FF]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D21FF]"
            aria-label="Refresh ticket inventory"
          >
            Refresh
          </button>
        </div>

        <section aria-labelledby="ticket-types-heading">
          <h2
            id="ticket-types-heading"
            className="mb-4 text-lg font-semibold text-white"
          >
            Ticket Types
          </h2>

          {inventoryError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-300"
            >
              {inventoryError}
              <button
                type="button"
                onClick={refresh}
                className="ml-3 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          ) : inventoryLoading && ticketTypes.length === 0 ? (
            <p className="text-sm text-[#21D4FF]/70">Loading ticket types…</p>
          ) : ticketTypes.length === 0 ? (
            <p className="text-sm text-[#21D4FF]/70">
              No ticket types have been created for this event yet.
            </p>
          ) : (
            <ul className="space-y-3" aria-live="polite">
              {ticketTypes.map((ticket) => (
                <TicketTypeRow key={ticket.id} ticket={ticket} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
