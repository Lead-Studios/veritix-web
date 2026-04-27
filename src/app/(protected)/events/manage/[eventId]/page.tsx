"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  name: string;
  status: string;
}

export default function ManageEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    fetch(`/api/events/${eventId}`)
      .then((r) => r.json())
      .then((data) => setEvent(data))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <main>
      <h1>Manage: {event.name}</h1>
      <p>Status: {event.status}</p>
    </main>
  );
}