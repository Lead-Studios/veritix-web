'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import {
  PASSWORD_RULES,
  passwordChangeSchema,
  passwordPolicyError,
  type PasswordChangeValues,
} from '@/lib/password';

/**
 * Rotating a password the user thinks is compromised.
 *
 * The current password is required even though the user is signed in: an
 * unlocked browser should not be enough to take over the account. The new
 * password is checked against the shared policy in `@/lib/password` — the same
 * one registration will use — and the confirmation must match.
 *
 * On success the server revokes every *other* session and reports how many. The
 * session that made the change survives, so the user is not signed out of the
 * tab they are looking at; the point is that a stolen cookie stops working.
 */

/** What the settings API returns after a successful change. */
export interface PasswordChangeResult {
  /** Other sessions that were revoked. `0` means there were none. */
  sessionsRevoked: number;
}

export interface PasswordFormProps {
  className?: string;
  onChanged?: (result: PasswordChangeResult) => void;
}

export function PasswordForm({ className, onChanged }: PasswordFormProps) {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    // Nothing pre-filled: an autofilled current password sitting in a form the
    // user did not open is a good way to change a password by accident.
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const newPassword = form.watch('newPassword');
  const newPasswordError = passwordPolicyError(newPassword);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const result = await api.post<PasswordChangeResult>('/settings/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      const revoked = result.sessionsRevoked;
      form.reset();
      toast.success(
        revoked > 0
          ? `Password changed — ${revoked} other ${revoked === 1 ? 'session' : 'sessions'} signed out`
          : 'Password changed',
      );
      onChanged?.(result);
    } catch (error) {
      // A wrong current password is the common case here, and the message the
      // server sends for it is more useful than anything generic.
      toast.error(
        error instanceof Error ? error.message : 'Could not change your password',
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn('space-y-6', className)} noValidate>
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Current password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  disabled={submitting}
                />
              </FormControl>
              <FormDescription>Required, so an unlocked browser is not enough.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>New password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  disabled={submitting}
                  aria-describedby="password-rules"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* The same rule list the schema enforces, so the form cannot promise
            something it does not check. */}
        <ul id="password-rules" aria-label="Password requirements" className="space-y-1">
          {PASSWORD_RULES.map((rule) => {
            const met = rule.test(newPassword);
            return (
              <li
                key={rule.id}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  met ? 'text-success' : 'text-muted-foreground',
                )}
              >
                {met ? (
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                ) : (
                  <X className="size-4 shrink-0" aria-hidden="true" />
                )}
                <span>{rule.label}</span>
                <span className="sr-only">{met ? ' — met' : ' — not met yet'}</span>
              </li>
            );
          })}
        </ul>

        {newPassword.length > 0 && newPasswordError !== null && (
          <p role="status" className="text-sm text-muted-foreground">
            Still to do: {newPasswordError.toLowerCase()}.
          </p>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting && <Spinner label={null} />}
          {submitting ? 'Changing…' : 'Change password'}
        </Button>
      </form>
    </Form>
  );
}
