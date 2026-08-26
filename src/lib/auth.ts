import { apiClient } from './apiClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

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
  const authResponse = await apiClient.post<AuthResponse>('/api/auth/login', payload);
  return authResponse;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post('/api/auth/forgot-password', { email });
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/auth/logout', {});
}
