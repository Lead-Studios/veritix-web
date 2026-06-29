"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import EventManagementTabs, { type ManagedEvent } from "@/features/events/components/EventManagementTabs";

export default function ManageEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<ManagedEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/events/${eventId}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data: ManagedEvent | null) => {
        if (!cancelled) setEvent(data ?? { id: eventId, name: `Event ${eventId}`, status: "DRAFT" });
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101428]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#4D21FF] border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101428]">
        <p className="text-white/60">Event not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101428] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 text-sm">
          <Link href="/events/manage" className="text-[#21D4FF] hover:underline">
            ← Back to events
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{event.name}</h1>
            <Breadcrumb
              className="mt-2 text-white/60"
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Events", href: "/events/manage" },
                { label: event.name },
              ]}
            />
          </div>
        </div>

        <EventManagementTabs
          event={event}
          onEventUpdate={(updates) => setEvent((prev) => prev ? { ...prev, ...updates } : prev)}
        />
      </div>
    </main>
  );
}
