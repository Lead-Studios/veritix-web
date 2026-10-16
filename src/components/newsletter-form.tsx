'use client';

import * as React from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Email capture for visitors who are browsing but not ready to buy.
 *
 * Validation runs inline on submit and again on every keystroke once the field
 * has been touched, so the message appears next to the field that caused it
 * rather than as a summary somewhere else on the page.
 *
 * `noValidate` on the form is deliberate. The browser's own bubble is
 * unlocalisable, unstyleable, and — because it is a native popup — invisible to
 * assistive technology until the field is focused. Owning the message means the
 * error text is real, announced, and rendered in the page's own type.
 */

export interface NewsletterFormProps {
  /** Endpoint to POST to. Overridable for a hosted form or a test double. */
  action?: string;
  /** States what a subscriber actually receives. Required by the issue. */
  description?: string;
  className?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Deliberately conservative: one `@`, a non-empty local part, a dotted domain,
 * no whitespace. A stricter RFC 5322 parser rejects addresses that deliver
 * perfectly well, and the only real test of an address is a confirmation email.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(email: string): string | undefined {
  const value = email.trim();
  if (!value) return 'Enter your email address.';
  if (!EMAIL.test(value)) return 'That does not look like an email address.';
  return undefined;
}

export function NewsletterForm({
  action = '/api/newsletter',
  description = 'One email a month: new events on Veritix, and how escrow settlement works. No promotions, and one click to leave.',
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const [status, setStatus] = React.useState<Status>('idle');
  const [failure, setFailure] = React.useState<string | null>(null);

  const fieldId = React.useId();
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  // The form is replaced by the confirmation when it succeeds, which takes the
  // submit button — and the focus — with it. Focus is moved to the replacement
  // so keyboard and screen reader users land on the answer instead of on the
  // top of the document.
  const confirmationRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (status === 'success') confirmationRef.current?.focus();
  }, [status]);

  const error = validate(email);
  // Nothing is flagged until the field has been left once, so a visitor is not
  // told they have an invalid email address before they have typed anything.
  const showError = touched && Boolean(error);
  const pending = status === 'submitting';

  // The input points at the description always, and at the error message only
  // while one is showing. Built here rather than inline because the expression
  // is long enough that inlining it produced an attribute nobody could read.
  const describedBy = [descriptionId, showError ? errorId : null].filter(Boolean).join(' ');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (error || status === 'submitting') return;

    setStatus('submitting');
    setFailure(null);

    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        setStatus('success');
        return;
      }

      // A 4xx body carries a message written for humans; a 5xx or an empty body
      // does not, and there is nothing useful to show for either.
      const payload = (await response.json().catch(() => null)) as {
        message?: unknown;
      } | null;
      const message =
        response.status >= 500
          ? 'Something went wrong on our side. Please try again in a moment.'
          : typeof payload?.message === 'string'
            ? payload.message
            : 'We could not sign you up. Please try again.';

      setFailure(message);
      setStatus('error');
    } catch {
      setFailure('We could not reach the server. Check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={confirmationRef}
        role="status"
        // Focusable programmatically, absent from the tab order: the next stop
        // is the one after the form, not the confirmation the user just read.
        tabIndex={-1}
        className={cn('rounded-lg border border-success/40 bg-success/10 p-4', className)}
      >
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          {/* The tick repeats what the sentence already says, so it is hidden
              from assistive technology rather than read out as a graphic. */}
          <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
          You are on the list
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a confirmation link to <span className="text-foreground">{email.trim()}</span>.
          Nothing is sent until you open it, so an address you did not mean to
          use can be removed by ignoring the message.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('space-y-3', className)}>
      <div className="space-y-1.5">
        <Label htmlFor={fieldId}>Email address</Label>
        {/* What a subscriber gets, stated before they are asked for anything. */}
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={fieldId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            // Re-validate as they type once the field has been left, so a
            // corrected address clears the error without another submit.
            if (status === 'error') setStatus('idle');
          }}
          onBlur={() => setTouched(true)}
          disabled={pending}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy || undefined}
          className="sm:flex-1"
        />
        <Button type="submit" disabled={pending} className="shrink-0">
          {pending ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Signing up…
            </>
          ) : (
            'Subscribe'
          )}
        </Button>
      </div>

      {/* Field-level message, so it is announced by the input that caused it
          rather than only appearing in a summary. */}
      {showError && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Request-level failure. `role="alert"` because it is the result of an
          explicit action and the user is waiting for an answer. */}
      {failure && (
        <p role="alert" className="text-sm text-destructive">
          {failure}
        </p>
      )}
    </form>
  );
}
