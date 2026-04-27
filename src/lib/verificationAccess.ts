// FE-087: Role-based access control for staff verification tools

export type UserRole = "attendee" | "organizer" | "staff" | "admin";

export function canAccessVerificationTools(role: UserRole | null): boolean {
  if (!role) return false;
  return role === "staff" || role === "organizer" || role === "admin";
}

export function getVerificationAccessDeniedMessage(role: UserRole | null): string {
  if (!role) return "Please sign in to access verification tools.";
  return "Verification tools are restricted to authorized staff only.";
}