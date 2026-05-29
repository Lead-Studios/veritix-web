// Helper for duplicating an event into the create-event form.
// Persists the source event's data into localStorage under the same key the
// create-event page reads from on mount, so navigating to `/events/create`
// hydrates the form with the duplicated data.

import type { EventFormData } from "@/app/(protected)/events/create/page";

export const DRAFT_KEY = "veritix_event_draft";
export const COPY_PREFIX = "Copy of ";

// Subset of EventFormData that can be JSON-serialised
// (File-backed fields like coverImage/gallery cannot be persisted).
export type DuplicableEventData = Partial<
  Omit<EventFormData, "coverImage" | "gallery">
>;

/**
 * Stash the source event's data so the create-event page picks it up on mount.
 * The title is prefixed with "Copy of " to make duplication explicit (and is
 * not double-prefixed if the source already starts with the prefix).
 */
export function prepareDuplicateDraft(source: DuplicableEventData): void {
  if (typeof window === "undefined") return;

  const baseTitle = source.title?.trim() || "Untitled";
  const title = baseTitle.startsWith(COPY_PREFIX)
    ? baseTitle
    : `${COPY_PREFIX}${baseTitle}`;

  const draft: DuplicableEventData = { ...source, title };

  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // localStorage may be unavailable (SSR / quota) — fail silently.
  }
}
