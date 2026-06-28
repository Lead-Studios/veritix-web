import { Event } from "@/types/event";

function getToken() {
  return (
    (typeof localStorage !== "undefined" && localStorage.getItem("auth_token")) ||
    (typeof sessionStorage !== "undefined" && sessionStorage.getItem("auth_token")) ||
    ""
  );
}

export async function fetchEventsByOrganizer(organizerId: string): Promise<Event[]> {
  const res = await fetch(`/api/events?organizerId=${encodeURIComponent(organizerId)}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch organizer events: ${res.status}`);
  return res.json();
}
