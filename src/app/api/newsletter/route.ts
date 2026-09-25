import { NextResponse, type NextRequest } from 'next/server';

/**
 * Newsletter signup, used by the form in `SiteFooter`.
 *
 *   POST /api/newsletter   { email } -> 201 { message }
 *
 * This route exists so the browser never learns where the list lives and never
 * holds a provider API key. It validates, forwards to the backend, and
 * translates the backend's status into something the form can show.
 *
 * Deliberately unauthenticated: the whole point is to capture visitors who have
 * no account. That makes it an unauthenticated write endpoint, so the input is
 * bounded and validated here rather than trusted.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LENGTH = 254;

/** Backend API base. Falls back to the app's own public API URL. */
function backendBase(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  return base.replace(/\/$/, '');
}

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

function upstream() {
  return NextResponse.json(
    { message: 'We could not sign you up. Please try again in a moment.' },
    { status: 502 },
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;

  if (!body || typeof body.email !== 'string') {
    return badRequest('Enter your email address.');
  }

  const email = body.email.trim().toLowerCase();

  if (!email) return badRequest('Enter your email address.');
  if (email.length > MAX_EMAIL_LENGTH) {
    return badRequest('That email address is too long.');
  }
  if (!EMAIL.test(email)) {
    return badRequest('That does not look like an email address.');
  }

  // No honeypot field. The obvious one (`company`) is autofilled by Chrome for
  // anyone whose saved address book has an organisation, so it silently blocks
  // real subscribers while doing nothing about a bot that reads the DOM. Rate
  // limiting belongs at the edge, in front of this route, not in a hidden input.
  const base = backendBase();
  if (!base) {
    // Misconfigured deployment, not a visitor error. Said plainly in the source
    // so nobody debugs it from the browser.
    return upstream();
  }

  try {
    const response = await fetch(`${base}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });

    // 200 and 201 both mean the address is in the system. 409 is the backend
    // saying "already subscribed", which is a success from the visitor's point
    // of view and must not be reported as a failure.
    if (response.ok || response.status === 409) {
      return NextResponse.json(
        { message: 'Check your inbox to confirm your subscription.' },
        { status: 201 },
      );
    }

    return upstream();
  } catch {
    return upstream();
  }
}

/**
 * Only POST exists here. Answering a GET with 405 rather than with a redirect
 * keeps a stray prefetch or a crawler's request from looking like a failed
 * signup.
 */
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
