import { EventFormData } from "@/app/(protected)/events/create/page";

export interface CreateEventResponse {
  id: string;
  slug: string;
}

export async function submitCreateEvent(
  data: EventFormData
): Promise<CreateEventResponse> {
  const body = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      body.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => body.append(key, v instanceof File ? v : String(v)));
    } else if (value !== null && value !== undefined) {
      body.append(key, String(value));
    }
  });

  const res = await fetch("/api/events", { method: "POST", body });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to create event. Please try again.");
  }
  return res.json();
}