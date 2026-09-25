import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

/**
 * Contact form.
 *
 * Client-side validation, a real success state, and spam protection that does
 * not involve a third-party script.
 *
 * ## Why not the native browser validation
 *
 * `noValidate` is deliberate. The browser's own bubble is unlocalisable,
 * unstyleable, and — being a native popup — invisible to assistive technology
 * until the field is focused. Owning the message means the error is real text in
 * the page's own type, linked to its input with `aria-describedby`, and
 * announced. The native constraints are still on the elements (`type="email"`,
 * `maxLength`, `required`) so autofill keeps working and so the form still
 * validates for anyone whose JavaScript has not loaded.
 *
 * The server re-validates all of it. Everything below is a courtesy to the
 * person filling the form in, not a check.
 *
 * ## Spam protection
 *
 * Two layers, both enforced in `src/app/api/contact/route.ts`:
 *
 * 1. **A honeypot field.** `hidden`, `tabIndex={-1}`, `aria-hidden`, and named
 *    something no address book has a field for. `hidden` means a bot that only
 *    fills visible fields skips it; a bot that fills everything trips it.
 * 2. **A minimum submit time.** The form records when it was rendered and the
 *    route rejects a submission that arrives implausibly fast. This is the layer
 *    that carries the weight, and it is worth being clear that it is a
 *    heuristic: no bot cannot be slowed down, only ones made expensive to run.
 *    The *absence* of a honeypot value is the strong signal.
 *
 * The obvious honeypot name, `company`, is deliberately not used — Chrome
 * autofills it for anyone with an organisation in their saved address book, so
 * it silently rejects real people. See the comment in the route.
 *
 * What is deliberately missing is rate limiting, because an in-memory counter in
 * a serverless function is not rate limiting. It belongs at the edge in front of
 * the route, and pretending otherwise would be worse than not having it.
 */

const MAX_MESSAGE = 2000;
const MAX_NAME = 80;
const MAX_EMAIL = 254;

/**
 * Shorter than the 2000 the field allows. A person who has written more than
 * this and been told it is too long is right to be annoyed, and they are almost
 * certainly writing to support about something that needs a paragraph.
 */
const MIN_MESSAGE = 20;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** How a person who fills this in reads to a stopwatch. */
const MIN_FILL_MS = 1200;

const TOPICS = [
  { value: 'support', label: 'Support — something is not working' },
  { value: 'organizer', label: 'Organizing an event' },
  { value: 'sales', label: 'Pricing, plans, or invoicing' },
  { value: 'partnerships', label: 'Partnerships' },
  { value: 'press', label: 'Press' },
  { value: 'other', label: 'Something else' },
] as const;

type FieldName = 'name' | 'email' | 'message';
type Status = 'idle' | 'submitting' | 'success' | 'error';

interface ContactFields {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  className?: string;
  /** Defaults to the contact API route. */
  action?: string;
}

export function ContactForm({ className, action = '/api/contact' }: ContactFormProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [topic, setTopic] = React.useState<string>(TOPICS[0].value);
  const [message, setMessage] = React.useState('');
  const [touched, setTouched] = React.useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = React.useState<Status>('idle');
  const [failure, setFailure] = React.useState<string | null>(null);

  const nameId = React.useId();
  const emailId = React.useId();
  const topicId = React.useId();
  const messageId = React.useId();
  const honeypotId = React.useId();
  const errorId = React.useId();

  // Empty until after hydration, which is what keeps the server and client
  // markup identical. The value is always set long before the form can be
  // submitted, because submitting requires the JavaScript that sets it.
  const [renderedAt, setRenderedAt] = React.useState('');
  React.useEffect(() => {
    setRenderedAt(String(Date.now()));
  }, []);

  // The success message replaces the form, which takes the submit button — and
  // the focus — with it. Focus follows, so the answer is where the keyboard is
  // rather than at the top of the document.
  const confirmationRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (status === 'success') confirmationRef.current?.focus();
  }, [status]);

  const errors = validate({ name, email, message });
  const pending = status === 'submitting';

  // Nothing is flagged until a field has been left once. Being told your email
  // address is invalid before you have finished typing it is the single most
  // common way a form talks over somebody.
  const errorFor = (field: FieldName) => (touched[field] ? errors[field] : undefined);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length > 0 || pending) return;

    setStatus('submitting');
    setFailure(null);

    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The honeypot and the render timestamp come from the form markup, not
        // from component state: both are only ever set by the real form, and a
        // bot posting JSON directly sends neither.
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          topic,
          message: message.trim(),
          companyUrl: String(form.get('companyUrl') ?? ''),
          renderedAt: String(form.get('renderedAt') ?? ''),
        }),
      });

      if (response.ok) {
        // Cleared on success, so a second message does not start from the text
        // of the first and a stale address is not resubmitted by muscle memory.
        setName('');
        setEmail('');
        setMessage('');
        setTouched({});
        setStatus('success');
        return;
      }

      const body = (await response.json().catch(() => null)) as
        | { message?: unknown }
        | null;
      setFailure(
        typeof body?.message === 'string' && body.message
          ? body.message
          : 'We could not send that. Please try again in a moment.',
      );
      setStatus('error');
    } catch {
      setFailure('We could not reach the server. Check your connection and try again.');
      setStatus('error');
    }
  }

  const markTouched = (field: FieldName) =>
    setTouched((current) => ({ ...current, [field]: true }));

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('space-y-6', className)}>
      {status === 'error' && failure && (
        <p
          id={errorId}
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {failure}
        </p>
      )}

      {status === 'success' ? (
        <div
          ref={confirmationRef}
          role="status"
          tabIndex={-1}
          className="rounded-lg border border-success/40 bg-success/10 p-6"
        >
          <h2 className="text-lg font-semibold tracking-tight">Message sent</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks — we have it. Someone will reply to the address you gave us, usually within two
            working days. If it is urgent, a ticket in your dashboard is faster than email.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => {
              setStatus('idle');
              // The timestamp is reset so the minimum-fill-time check does not
              // reject the second message for arriving too soon after a re-render
              // that the person did not cause.
              setRenderedAt(String(Date.now()));
            }}
          >
            Send another message
          </Button>
        </div>
      ) : (
        <>
          <Field
            id={nameId}
            label="Your name"
            required
            error={errorFor('name')}
            errorId={`${nameId}-error`}
          >
            {(described) => (
              <Input
                {...described}
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => markTouched('name')}
                disabled={pending}
                maxLength={MAX_NAME}
                autoComplete="name"
                required
              />
            )}
          </Field>

          <Field
            id={emailId}
            label="Email address"
            required
            hint="We reply to this address and nowhere else."
            error={errorFor('email')}
            errorId={`${emailId}-error`}
          >
            {(described) => (
              <Input
                {...described}
                name="email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => markTouched('email')}
                disabled={pending}
                maxLength={MAX_EMAIL}
                autoComplete="email"
                required
              />
            )}
          </Field>

          <Field id={topicId} label="What is this about?">
            {(described) => (
              <select
                {...described}
                name="topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                disabled={pending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {TOPICS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field
            id={messageId}
            label="Message"
            required
            hint="What happened, what you expected, and any references help."
            error={errorFor('message')}
            errorId={`${messageId}-error`}
          >
            {(described) => (
              <Textarea
                {...described}
                name="message"
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onBlur={() => markTouched('message')}
                disabled={pending}
                maxLength={MAX_MESSAGE}
                required
              />
            )}
          </Field>

          {/*
            The honeypot.

            `hidden` takes it out of the accessibility tree, out of the tab
            order, and out of view. `tabIndex` and `aria-hidden` are belt and
            braces for the case where the stylesheet has not loaded: an
            off-screen but focusable field is exactly the keyboard trap this is
            supposed to be avoiding.

            The name is deliberately not `company`. Chrome autofills that for
            anyone whose saved address book has an organisation, so a honeypot
            named `company` rejects a real person's message. This one is long
            enough that no autofill heuristic matches it, and short enough to
            read in a DOM dump.
          */}
          <div hidden aria-hidden="true">
            <label htmlFor={honeypotId}>Company website</label>
            <input
              id={honeypotId}
              name="companyUrl"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <input type="hidden" name="renderedAt" value={renderedAt} />

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={pending}>
              {pending ? 'Sending…' : 'Send message'}
            </Button>
            <p className="text-sm text-muted-foreground">
              We use your details to answer this and nothing else.
            </p>
          </div>
        </>
      )}
    </form>
  );
}

function validate(fields: ContactFields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};

  const name = fields.name.trim();
  if (name.length < 2) errors.name = 'Tell us who you are.';

  const email = fields.email.trim();
  if (!email) errors.email = 'We need an address to reply to.';
  else if (!EMAIL_PATTERN.test(email))
    errors.email = 'That does not look like an email address.';

  const message = fields.message.trim();
  if (message.length < MIN_MESSAGE) errors.message = 'A little more detail, please.';
  else if (message.length > MAX_MESSAGE)
    errors.message = 'That is longer than we can read.';

  return errors;
}

/** Attributes `Field` hands to its input, so every field gets them the same way. */
interface DescribedField {
  id: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  /** Id for the error paragraph. Required when `error` can be set. */
  errorId?: string;
  children: (described: DescribedField) => React.ReactNode;
}

/**
 * One labelled field with its hint and its error.
 *
 * The error is a sibling of the input, in a paragraph the input points at with
 * `aria-describedby` — not a `title` attribute, not a placeholder. That is what
 * makes it announced when the input takes focus and readable by a screen reader
 * user who is not focusing the field at all. `aria-invalid` is set only when
 * there is an error to point at, because a field permanently marked invalid is
 * an error with no message.
 */
function Field({ id, label, required, hint, error, errorId, children }: FieldProps) {
  const hintId = `${id}-hint`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>

      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}

      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': [hint ? hintId : null, error && errorId ? errorId : null]
          .filter(Boolean)
          .join(' ') || undefined,
      })}

      {error && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
