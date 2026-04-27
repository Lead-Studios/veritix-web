// FE-065: Draft persistence helpers for create-event flow

export interface EventDraft {
  id?: string;
  formData: Record<string, unknown>;
  savedAt: string;
}

export async function saveDraft(formData: Record<string, unknown>): Promise<EventDraft> {
  const res = await fetch("/api/events/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formData }),
  });
  if (!res.ok) throw new Error("Failed to save draft. Please try again.");
  return res.json();
}

export async function loadDraft(draftId: string): Promise<EventDraft | null> {
  const res = await fetch(`/api/events/drafts/${draftId}`);
  if (!res.ok) return null;
  return res.json();
}