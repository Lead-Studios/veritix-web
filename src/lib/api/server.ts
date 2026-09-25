import { NextResponse, type NextRequest } from 'next/server';

/**
 * Plumbing shared by the API routes this app owns.
 *
 * Every handler in `src/app/api/` is a thin server-side proxy. Two reasons
 * force the request through the server: the backend holds credentials the
 * browser must never see, and validating a request against a session is not
 * something the client can be trusted to do. So the pattern repeats, and
 * repeating it five times invites five slightly different session checks.
 *
 * This module is that pattern, written once. It is server-only by
 * construction — it reads `process.env` directly and is never imported from a
 * client component.
 *
 * `src/app/api/orders/route.ts` still carries its own local copy of this
 * plumbing. Collapsing it onto this module is a one-file refactor and is not
 * done here, because the routes below are additive and rewriting a working
 * route to share code with them widens this change for no user-visible gain.
 */

/**
 * Session cookie names, in the order they are tried.
 *
 * These are inconsistent in the codebase today and this module does not hide
 * that: `src/app/api/orders` and `src/app/api/tickets` set
 * `session_user_id`, while `src/proxy.ts` reads `veritix_session`. One of the
 * two is authoritative and the other is a leftover, but which one is not
 * knowable from inside this repository, so both are accepted. A request
 * authorised by either cookie is authorised; a change to one of them that
 * breaks the other will show up as a 401 here, not as a silent bypass.
 *
 * Whatever the backend reports about the session is authoritative. The cookie
 * identifies the user; it does not prove the session is still valid.
 */
const SESSION_COOKIE_NAMES = ['session_user_id', 'veritix_session'] as const;

/**
 * The signed-in user id, or `null`.
 *
 * An empty value counts as signed out. A cookie set to `""` is what a handler
 * that deleted it without an expiry leaves behind, and treating that as user
 * `""` would produce a request the backend happily cannot find — a 404 on an
 * authenticated route is a much worse error message than a 401.
 */
export function readSessionUserId(request: NextRequest): string | null {
  for (const name of SESSION_COOKIE_NAMES) {
    const value = request.cookies.get(name)?.value?.trim();
    if (value) return value;
  }

  return null;
}

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ message }, { status, headers });
}

export function unauthorized(): NextResponse {
  // Deliberately says nothing about why. Telling an anonymous caller which
  // cookie is missing turns a 401 into a description of the auth mechanism.
  return jsonError('You need to be signed in to do that.', 401, {
    'Cache-Control': 'no-store',
  });
}

/** Backend API base. Falls back to the app's own public API URL. */
function backendBase(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  return base.replace(/\/$/, '');
}

/**
 * Raised when the backend is unreachable, unconfigured, or returned an error
 * body. `status` carries the backend's own status where there was one, so a
 * route can pass a client error through instead of flattening everything to
 * 502.
 */
export class BackendError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'BackendError';
  }
}

/**
 * Send a request to the backend and return its parsed body.
 *
 * Throws `BackendError` on any non-2xx. Every caller here is a proxy, so
 * "succeeded" has to mean the backend said yes rather than that `fetch`
 * returned.
 */
export async function forwardToBackend<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const base = backendBase();
  if (!base) throw new BackendError(502, 'No backend API base URL configured');

  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    cache: 'no-store',
  });

  const text = await response.text();
  const payload: unknown = text ? safeJson(text) : undefined;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : response.statusText;
    throw new BackendError(response.status, message, payload);
  }

  return payload as T;
}

/**
 * Forward a request to the backend on behalf of `userId`.
 *
 * `userId` is merged into the body, which is how the existing routes address a
 * record to its owner. The backend is trusted to enforce that the id belongs to
 * the session it is called with; the client cannot be trusted to send it, and
 * this value comes from a cookie rather than from a request field.
 *
 * `data` is an object, not a pre-serialised string, precisely so that this
 * merge is a merge. Taking a `RequestInit` here would mean the caller had
 * already turned the body into a string, and `{ userId, ...someString }` is a
 * character spread rather than an object spread — a bug that compiles and
 * ships a body of `{"0":"{","1":"""…}`.
 */
export function callBackend<T>(
  path: string,
  data: Record<string, unknown> & { userId: string },
  init: Omit<RequestInit, 'body'> = {},
): Promise<T> {
  return forwardToBackend<T>(path, {
    ...init,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Turn a `BackendError` into a response.
 *
 * A 4xx from the backend is passed through, because it is about this request:
 * the settings form needs to know that a password was wrong, not that the
 * service is down. Anything else — 5xx, a network failure, a missing base URL,
 * a non-JSON body from something that is not the backend — becomes a 502 with
 * a fixed message, so an infrastructure fault never leaks an internal error
 * string to the browser.
 */
export function toResponse(error: unknown): NextResponse {
  if (error instanceof BackendError && error.status >= 400 && error.status < 500) {
    return jsonError(error.message, error.status, { 'Cache-Control': 'no-store' });
  }

  return jsonError('The service is unavailable. Please try again in a moment.', 502, {
    'Cache-Control': 'no-store',
  });
}
