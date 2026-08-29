import { Event } from '@/types/event';

export async function fetchEventsByOrganizer(organizerId: string): Promise<Event[]> {
  const res = await fetch(`/api/events?organizerId=${encodeURIComponent(organizerId)}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Failed to fetch organizer events: ${res.status}`);
  return res.json();
}
