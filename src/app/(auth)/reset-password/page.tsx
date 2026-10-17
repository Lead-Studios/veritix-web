'use client';

import * as React from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiError, api } from '@/lib/api-client';
import { passwordSchema } from '@/lib/password';
import { routes } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [expired, setExpired] = React.useState(!token);
  const [complete, setComplete] = React.useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const parsedPassword = passwordSchema.safeParse(password);
    if (!parsedPassword.success) {
      setError(parsedPassword.error.issues[0]?.message ?? 'Choose a stronger password.');
      return;
    }
    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }
    if (!token) {
      setExpired(true);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: parsedPassword.data });
      setComplete(true);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : 'Could not reset your password.';
      if (
        requestError instanceof ApiError &&
        (requestError.status === 410 ||
          /(?:token|reset link).{0,30}(?:expired|invalid)|(?:expired|invalid).{0,30}(?:token|reset link)/i.test(
            message,
          ))
      ) {
        setExpired(true);
      } else {
        setError(token ? message.split(token).join('[redacted]') : message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border bg-background p-6 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a new password for your Veritix account.
        </p>
      </div>

      {expired ? (
        <div className="space-y-4">
          <p role="alert" className="text-sm text-destructive">
            This password reset link is missing or has expired. Request a new one to continue.
          </p>
          <Button asChild>
            <Link href={routes.forgotPassword}>Request a new reset link</Link>
          </Button>
        </div>
      ) : complete ? (
        <div className="space-y-4">
          <p role="status" className="text-sm">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Button asChild>
            <Link href={routes.login}>Sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="reset-password" required>
              New password
            </Label>
            <Input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reset-password-confirmation" required>
              Confirm new password
            </Label>
            <Input
              id="reset-password-confirmation"
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={submitting}
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting && <Spinner label={null} />}
            {submitting ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>
      )}

      <p className="text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href={routes.login} className="text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading reset link…</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
