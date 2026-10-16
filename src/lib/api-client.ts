import { env } from '@/lib/env';

/**
 * Typed fetch wrapper. Every network call in the app should go through this so
 * error shape, timeouts, and JSON handling are uniform.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /** True for 4xx responses, which usually mean the caller should not retry. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Serialized as JSON unless it is already a string or FormData. */
  body?: unknown;
  /** Abort the request after this many milliseconds. Defaults to 15000. */
  timeoutMs?: number;
  /** Query parameters appended to the path. Undefined values are dropped. */
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const base = path.startsWith('http') ? path : `${env.NEXT_PUBLIC_API_URL}${path}`;
  if (!query) return base;

  const url = new URL(base);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, timeoutMs = 15_000, query, headers, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const serialized =
    body === undefined ? undefined : isFormData || typeof body === 'string' ? (body as BodyInit) : JSON.stringify(body);

  try {
    const response = await fetch(buildUrl(path, query), {
      ...rest,
      signal: controller.signal,
      headers: {
        ...(isFormData || typeof body === 'string' ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: serialized,
    });

    const text = await response.text();
    const parsed: unknown = text ? safeJson(text) : undefined;

    if (!response.ok) {
      throw new ApiError(response.status, extractMessage(parsed) ?? response.statusText, parsed);
    }

    return parsed as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, `Request to ${path} timed out after ${timeoutMs}ms`);
    }
    throw new ApiError(0, error instanceof Error ? error.message : 'Network request failed');
  } finally {
    clearTimeout(timer);
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return undefined;
}

/** SWR-compatible fetcher. */
export const fetcher = <T>(path: string): Promise<T> => apiRequest<T>(path);

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
