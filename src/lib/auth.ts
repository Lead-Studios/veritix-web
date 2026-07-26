import { apiClient } from "./apiClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string; name?: string };
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const authResponse = await apiClient.post<AuthResponse>(
    "/api/auth/login",
    payload,
  );
  if (typeof window !== "undefined") {
    if (payload.rememberMe) {
      localStorage.setItem("auth_token", authResponse.token);
    } else {
      sessionStorage.setItem("auth_token", authResponse.token);
    }
  }
  return authResponse;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post("/api/auth/forgot-password", { email });
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token")
  );
}
