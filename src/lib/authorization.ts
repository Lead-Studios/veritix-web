// FE-095: Session-based authorization helpers to replace hardcoded owner checks

export interface SessionUser {
  id: string;
  email: string;
  role: "organizer" | "attendee" | "admin";
}

export function isEventOwner(event: { ownerId: string }, user: SessionUser | null): boolean {
  if (!user) return false;
  return event.ownerId === user.id;
}

export function canManageEvent(event: { ownerId: string }, user: SessionUser | null): boolean {
  if (!user) return false;
  return isEventOwner(event, user) || user.role === "admin";
}