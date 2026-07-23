import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchEventById, fetchEvents } from "@/lib/eventsApi";
import EventHero from "./EventHero";
import EventInfoBar from "./EventInfoBar";
import EventTabs from "./EventTabs";
import TicketPurchase from "./TicketPurchase";

export const revalidate = 60;

const POPULAR_EVENTS_LIMIT = 20;

interface Props {
  params: Promise<{ eventId: string }>;
}

export async function generateStaticParams() {
  const events = await fetchEvents().catch(() => []);
  return [...events]
    .sort((a, b) => (b.attendees ?? 0) - (a.attendees ?? 0))
    .slice(0, POPULAR_EVENTS_LIMIT)
    .map((event) => ({ eventId: event.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params;
  const event = await fetchEventById(eventId).catch(() => null);
  if (!event) {
    return { title: "Event Not Found | VeriTix" };
  }
  return {
    title: `${event.name} | VeriTix`,
    description: event.description
      ? event.description.slice(0, 160)
      : `Buy tickets for ${event.name} on VeriTix.`,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params;
  // null means 404 only; other errors must throw so ISR keeps serving the
  // stale page instead of caching a 404 for a live event
  const event = await fetchEventById(eventId);
  if (!event) notFound();

  return (
    <div className="min-h-screen bg-primary-dark-blue">
      <EventHero eventId={event.id} eventName={event.name} image={event.image} />

      <EventInfoBar
        date={event.date}
        time={event.time}
        venue={event.venue}
        attendees={event.attendees}
      />

      <EventTabs
        description={event.description}
        schedule={event.schedule}
        performers={event.performers}
      >
        <TicketPurchase
          eventId={event.id}
          eventName={event.name}
          ticketOptions={event.ticketOptions}
          organizer={event.organizer}
        />
      </EventTabs>
    </div>
  );
}
