"use client";

import { LiveCheckInCounter } from "@/components/dashboard/LiveCheckInCounter";
import { useParams } from "next/navigation";

/**
 * Determine if an event is "live" based on its start/end datetimes.
 * Replace with a real status field from your API if available.
 */
function isEventLive(startIso: string, endIso: string): boolean {
  const now = Date.now();
  return (
    now >= new Date(startIso).getTime() && now <= new Date(endIso).getTime()
  );
}

const DEMO_EVENT = {
  id: "demo-123",
  name: "Afrobeats Night Lagos",
  startIso: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // started 30 min ago
  endIso: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // ends in 3 h
};

export default function AnalyticsLivePage() {
  const params = useParams<{ eventId?: string }>();
  const eventId = params?.eventId ?? DEMO_EVENT.id;

  const live = isEventLive(DEMO_EVENT.startIso, DEMO_EVENT.endIso);

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header>
        <h1 className="text-2xl font-bold text-[#013237]">
          Analytics — {DEMO_EVENT.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time attendance and ticket metrics for organizers.
        </p>
      </header>

      <section aria-labelledby="checkin-section">
        <h2 id="checkin-section" className="sr-only">
          Check-in counter
        </h2>
        <LiveCheckInCounter
          eventId={eventId}
          isLive={live}
          className="max-w-sm"
        />
      </section>

      <section className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
        Additional analytics widgets (revenue chart, ticket mix, …) — later wave
      </section>
    </main>
  );
}