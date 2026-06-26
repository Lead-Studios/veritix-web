"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "@/components/ui";
import { Breadcrumb } from "@/components/ui";
import { performEventAction } from "@/lib/eventActions";
import TabSelector from "@/components/TabSelector";
import AttendeesTab from "@/components/events/manage/AttendeesTab";
import { TicketTypeRow } from "@/components/events/manage/TicketTypeRow";
import { useEventInventory } from "@/hooks/useEventInventory";

interface ManagedEvent {
  id: string;
  name: string;
  status: string;
}

const TABS = ["Overview", "Attendees"] as const;
type Tab = (typeof TABS)[number];

export default function ManageEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<ManagedEvent | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
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

  const handleConfirmCancel = async () => {
    if (!event || submitting) return;
    setSubmitting(true);
    try {
      const result = await performEventAction(event.id, "cancel");
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("Event cancelled. Refunds and notifications have been queued.");
      setEvent({ ...event, status: "cancelled" });
      setConfirmOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel event.");
    } finally {
      setSubmitting(false);
    }
  };

  if (eventLoading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;

  const isCancelled = event.status === "cancelled";

  return (
    <main className="min-h-screen bg-[#101428] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Manage: {event.name}</h1>
        <p className="mt-2 text-[#21D4FF]/80">Status: {event.status}</p>
        <Breadcrumb
          className="mt-3 text-white/60"
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Events", href: "/events/manage" },
            { label: event.name },
          ]}
        />
  const isCancelled = event?.status === "cancelled";

  return (
    <div className="min-h-screen bg-[#101428] py-10 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-sm">
          <Link href="/events/manage" className="text-[#21D4FF] hover:underline">
            ← Back to events
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {eventLoading ? "Loading event…" : event?.name ?? "Event not found"}
            </h1>
            {event && !eventLoading && (
              <p className="mt-1 text-sm text-[#21D4FF]/80">Status: {event.status}</p>
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

        {event && (
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Events", href: "/events/manage" },
              { label: event.name },
            ]}
          />
        )}

        <TabSelector<Tab>
          tabs={TABS as unknown as Tab[]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="!px-0"
        />

        {activeTab === "Overview" && (
          <>
            <section aria-labelledby="ticket-types-heading" className="mt-6">
              <h2 id="ticket-types-heading" className="mb-4 text-lg font-semibold text-white">
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

            <section
              role="tabpanel"
              aria-label="Overview"
              className="mt-6 rounded-xl border border-red-700/50 bg-red-950/20 p-6"
            >
              <h2 className="text-lg font-semibold text-red-300">Danger zone</h2>
              <p className="mt-1 text-sm text-red-200/80">
                Cancelling this event is irreversible. All ticket holders will be refunded and
                notified automatically.
              </p>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={isCancelled}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelled ? "Event already cancelled" : "Cancel Event"}
              </button>
            </section>
          </>
        )}

        {activeTab === "Attendees" && (
          <div role="tabpanel" aria-label="Attendees" className="mt-6">
            {event && <AttendeesTab eventId={event.id} />}
          </div>
        )}
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => {
          if (!submitting) setConfirmOpen(false);
        }}
        title="Cancel this event?"
        description="This action is permanent and cannot be undone."
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-red-700/40 bg-red-950/30 p-4">
            <AlertTriangle className="mt-0.5 shrink-0 text-red-400" size={20} aria-hidden="true" />
            <div className="text-sm text-red-100/90">
              <p className="font-semibold text-red-200">
                Cancelling &ldquo;{event?.name}&rdquo; will:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-red-100/80">
                <li>Trigger refunds for every ticket already sold.</li>
                <li>Notify all attendees by email and in-app notification.</li>
                <li>Mark the event as cancelled on the public events page.</li>
                <li>Prevent any further ticket sales for this event.</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={submitting}
              className="rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Keep event
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden="true"
                />
              )}
              {submitting ? "Cancelling…" : "Confirm Cancellation"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
