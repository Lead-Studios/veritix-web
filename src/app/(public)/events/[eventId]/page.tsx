import type { Metadata } from "next";
import { fetchEventById } from "@/lib/eventsApi";
import EventDetailClient from "./EventDetailClient";

interface Props {
  params: Promise<{ eventId: string }>;
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

export default function EventDetailPage() {
  return <EventDetailClient />;
}
