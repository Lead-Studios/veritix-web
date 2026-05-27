const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? (localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token"))
      : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Change password ──────────────────────────────────────────────────────────

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to update password.");
  }
}

// ── Notification preferences ─────────────────────────────────────────────────

export interface NotificationPreferences {
  upcomingEvents: boolean;
  ticketConfirmations: boolean;
  platformUpdates: boolean;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const res = await fetch(`${API_BASE}/api/profile/notification-preferences`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load notification preferences.");
  return res.json() as Promise<NotificationPreferences>;
}

export async function patchNotificationPreference(
  key: keyof NotificationPreferences,
  value: boolean,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/profile/notification-preferences`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ [key]: value }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to update preference.");
  }
}

// ── Account deletion ─────────────────────────────────────────────────────────

export async function deleteAccount(email: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/profile/account`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to delete account.");
  }
}

// ── Profile edit ─────────────────────────────────────────────────────────────

export interface ProfileData {
  name: string;
  email: string;
}

export async function getProfile(): Promise<ProfileData> {
  const res = await fetch(`${API_BASE}/api/profile`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load profile.");
  return res.json() as Promise<ProfileData>;
}

export async function updateProfile(payload: ProfileData): Promise<void> {
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to save profile.");
  }
}
