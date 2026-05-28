"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "@/components/ui";
import { performEventAction } from "@/lib/eventActions";

interface Event {
  id: string;
  name: string;
  status: string;
}

export default function ManageEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    fetch(`/api/events/${eventId}`)
      .then((r) => r.json())
      .then((data) => setEvent(data))
      .finally(() => setLoading(false));
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

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;

  const isCancelled = event.status === "cancelled";

  return (
    <main className="min-h-screen bg-[#101428] px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Manage: {event.name}</h1>
        <p className="mt-2 text-[#21D4FF]/80">Status: {event.status}</p>

        {/* Danger zone — Cancel Event */}
        <section className="mt-10 rounded-xl border border-red-700/50 bg-red-950/20 p-6">
          <h2 className="text-lg font-semibold text-red-300">Danger zone</h2>
          <p className="mt-1 text-sm text-red-200/80">
            Cancelling this event is irreversible. All ticket holders will be
            refunded and notified automatically.
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
      </div>

      {/* Themed cancellation confirmation modal */}
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
                Cancelling &ldquo;{event.name}&rdquo; will:
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
    </main>
  );
}
