import { getToken } from "./auth";

/**
 * Drop-in replacement for `fetch` that attaches an `Authorization: Bearer`
 * header when a token is present in localStorage / sessionStorage.
 *
 * Public, read-only endpoints that do not require authentication can call
 * plain `fetch` directly — they are explicitly exempted from using this
 * helper.
 */
export async function authedFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options?.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, { ...options, headers });
}
