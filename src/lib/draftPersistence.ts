import { EventFormData } from "./createEventSubmit";

// FE-065: Draft persistence helpers for create-event flow

const DRAFT_STORAGE_KEY = "veritix_event_draft";
const STALE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface EventDraft {
  id?: string;
  formData: Partial<EventFormData>;
  savedAt: string;
}

function writeLocalDraft(draft: EventDraft): void {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (e: unknown) {
    console.error("Failed to write draft to local storage", e);
  }
}

function readLocalDraft(): EventDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const draft: EventDraft = JSON.parse(raw);
    if (Date.now() - new Date(draft.savedAt).getTime() > STALE_THRESHOLD_MS) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }
    return draft;
  } catch (e: unknown) {
    console.error("Failed to read draft from local storage", e);
    return null;
  }
}

function clearLocalDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (e: unknown) {
    console.error("Failed to clear draft from local storage", e);
  }
}

export async function saveDraft(
  formData: Partial<EventFormData>,
): Promise<EventDraft> {
  const localDraft: EventDraft = {
    formData,
    savedAt: new Date().toISOString(),
  };
  writeLocalDraft(localDraft);

  try {
    const res = await fetch("/api/events/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData }),
    });
    if (res.ok) {
      const serverDraft = (await res.json()) as EventDraft;
      writeLocalDraft(serverDraft);
      return serverDraft;
    }
  } catch (e: unknown) {
    console.error("Failed to save draft to server", e);
  }

  return localDraft;
}

export async function loadDraft(draftId: string): Promise<EventDraft | null> {
  const local = readLocalDraft();
  if (local && local.id === draftId) return local;

  try {
    const res = await fetch(`/api/events/drafts/${draftId}`);
    if (res.ok) {
      const serverDraft = (await res.json()) as EventDraft;
      writeLocalDraft(serverDraft);
      return serverDraft;
    }
  } catch (e: unknown) {
    console.error("Failed to load draft from server", e);
  }

  return local;
}
