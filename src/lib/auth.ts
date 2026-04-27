const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string; name?: string };
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Login failed. Please check your credentials.");
  }

  return res.json() as Promise<AuthResponse>;
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to send reset link. Please try again.");
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
}
