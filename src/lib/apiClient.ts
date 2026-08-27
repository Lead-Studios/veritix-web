import { getSession } from "next-auth/react";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getHeaders(body?: unknown) {
  const session = await getSession();
  const headers: HeadersInit = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: unknown = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    const message =
      typeof errorData === "object" &&
      errorData !== null &&
      "message" in errorData &&
      typeof errorData.message === "string"
        ? errorData.message
        : "API request failed";
    throw new ApiError(
      message,
      response.status,
    );
  }
  return response.json();
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers = await getHeaders(body);
  const config: RequestInit = {
    method,
    headers,
  };
  if (body !== undefined) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  return handleResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};
