import { getSession } from "next-auth/react";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getHeaders() {
  const session = await getSession();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new ApiError(
      errorData.message || "API request failed",
      response.status,
    );
  }
  return response.json();
}

async function request<T>(
  method: string,
  path: string,
  body?: any,
): Promise<T> {
  const headers = await getHeaders();
  const config: RequestInit = {
    method,
    headers,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  return handleResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: any) => request<T>("POST", path, body),
  put: <T>(path: string, body: any) => request<T>("PUT", path, body),
  patch: <T>(path: string, body: any) => request<T>("PATCH", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};
