import { EventFormData } from "@/app/(protected)/events/create/page";
import { apiClient } from "./apiClient";

export interface CreateEventResponse {
  id: string;
  slug: string;
}

export async function submitCreateEvent(
  data: EventFormData,
): Promise<CreateEventResponse> {
  const body = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      body.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v instanceof File) {
          body.append(key, v);
        } else if (typeof v === "object" && v !== null) {
          body.append(key, JSON.stringify(v));
        } else {
          body.append(key, String(v));
        }
      });
    } else if (value !== null && value !== undefined) {
      if (typeof value === "object") {
        body.append(key, JSON.stringify(value));
      } else {
        body.append(key, String(value));
      }
    }
  });

  return apiClient.post<CreateEventResponse>("/api/events", body);
}
