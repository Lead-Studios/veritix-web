import { getToken } from "./auth";

export async function authedFetch(
  url: RequestInfo,
  options?: RequestInit,
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options?.headers);

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
