// FE-096: Organizer event lifecycle actions
// Adds edit, publish, unpublish, and cancel/archive actions to the manage-event screen.

export type EventAction = "publish" | "unpublish" | "cancel" | "archive";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function performEventAction(
  eventId: string,
  action: EventAction
): Promise<ActionResult> {
  const res = await fetch(`/api/events/${eventId}/actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) return { success: false, message: "Action failed. Please try again." };
  return { success: true, message: `Event ${action}d successfully.` };
}

export const DESTRUCTIVE_ACTIONS: EventAction[] = ["cancel", "archive"];

export function requiresConfirmation(action: EventAction): boolean {
  return DESTRUCTIVE_ACTIONS.includes(action);
}