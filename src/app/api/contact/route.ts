import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import { forwardToBackend } from '@/lib/api/server';

/**
 * POST /api/contact
 *
 * Receives a message from the contact form, checks it, and forwards it to the
 * backend. The browser never talks to the backend directly: the honeypot and the
 * timing check live here, and a client that skipped this route would skip both.
 *
 * ## Spam protection, and what it is worth
 *
 * Two checks, no third-party script, no CAPTCHA, and no invisible reCAPTCHA that
 * quietly loads a third party's code on every page view.
 *
 * 1. **Honeypot.** A field that is `hidden`, so a bot that only fills visible
 *    fields skips it, and a bot that fills everything trips it. A trip is
 *    answered with a *successful* response, because a bot that is told it was
 *    detected adapts and a bot that is told nothing has no signal to work from.
 *    The cost of that is that a real person who trips it sees a confirmation for
 *    a message nobody will read — which is why the field is `hidden`,
 *    `autocomplete="off"`, and named something no address book has a column for.
 *    The obvious name, `company`, is autofilled by Chrome for anyone with an
 *    employer in their saved addresses, so a honeypot named `company` rejects
 *    real people. That is the exact opposite of its purpose.
 * 2. **Minimum fill time.** A submission that arrives implausibly soon after the
 *    form was rendered is refused, and refused *honestly*, with a 429 the person
 *    can act on.
 *
 * The difference between the two is deliberate. The honeypot is a strong signal
 * with a low false-positive rate, so a false positive is nearly always a bot and
 * is best served by silence. The timing check is a weak signal with a real
 * chance of catching a fast human, so a false positive there has to be visible
 * and recoverable.
 *
 * This is a heuristic, and it is worth being plain about that. There is no bot
 * that cannot be slowed down, only ones made expensive to run, and a bot that
 * waits three seconds walks straight past check two. What it reliably removes is
 * the naive form spammer, which is the overwhelming majority of it.
 *
 * ## What is not here
 *
 * **Rate limiting.** An in-memory counter in a serverless function is not rate
 * limiting: each instance has its own, and they scale out with traffic, which is
 * the opposite of what a limit does. Real limiting is shared per-IP state, which
 * belongs at the edge in front of this route. A counter here would read as
 * protection while providing none.
 */

const MIN_FILL_MS = 2500;

/** Tolerance for a client whose clock runs behind the server's. */
const CLOCK_SKEW_MS = 60_000;

const MAX_EMAIL = 254;

const contactBody = z.object({
  name: z.string().trim().min(2).max(80),
  // Lowercased here rather than only in the form, so a direct POST that skips
  // the form gets the same normalisation. `toLowerCase()` is a Zod transform,
  // so the `email` check runs against the lowercased value, not the original.
  email: z.string().trim().toLowerCase().pipe(z.string().max(MAX_EMAIL).email()),
  topic: z.string().trim().min(1).max(40),
  message: z.string().trim().min(20).max(2000),
  /** The honeypot. Expected to be empty. The schema does not reject it. */
  companyUrl: z.string().max(200).optional(),
  /** When the form was rendered, as a client-side `Date.now()`. */
  renderedAt: z.string().max(20).optional(),
});

const STALE_FORM = {
  message: 'That looked like a stale form. Please reload and try again.',
};

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = contactBody.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Check the form and try again.',
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const { companyUrl, renderedAt, ...message } = parsed.data;

  // Honeypot. Answered as a success — see the note at the top of the file.
  if (companyUrl && companyUrl.trim()) {
    return NextResponse.json({ message: 'Message received.' }, { status: 201 });
  }

  // A submission with no render timestamp did not come from the form.
  const rendered = renderedAt ? Number(renderedAt) : Number.NaN;
  if (!Number.isFinite(rendered)) {
    return NextResponse.json(STALE_FORM, { status: 400 });
  }

  // A timestamp in the future is a client trying to get past the check below.
  if (rendered - Date.now() > CLOCK_SKEW_MS) {
    return NextResponse.json(STALE_FORM, { status: 400 });
  }

  // Refused honestly, because a fast human is a real possibility and a silent
  // success would be a message that goes nowhere.
  if (Date.now() - rendered < MIN_FILL_MS) {
    return NextResponse.json(
      { message: 'That was too quick to be a real submission. Please send it again.' },
      { status: 429, headers: { 'Retry-After': '2' } },
    );
  }

  try {
    // No `userId`: a contact form is anonymous by definition, and forwarding a
    // blank one would be a lie the backend has to work around.
    await forwardToBackend('/contact', { method: 'POST', body: JSON.stringify(message) });
    return NextResponse.json({ message: 'Message received.' }, { status: 201 });
  } catch {
    // No backend configured, unreachable, or refusing. The person gets a fixed
    // message and a 502 — not whatever the upstream said, which is both
    // unhelpful and a way to probe the backend from the public internet.
    return NextResponse.json(
      { message: 'We could not send that just now. Please try again in a moment.' },
      { status: 502 },
    );
  }
}
