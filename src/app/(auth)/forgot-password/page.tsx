'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'react-toastify';
import { api } from '@/lib/api-client';
import { routes } from '@/lib/routes';

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot password page.
 *
 * Takes an email and always shows the same confirmation whether or not the
 * account exists, so the form cannot be used to enumerate users.
 */
export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [emailForConfirmation, setEmailForConfirmation] = React.useState('');

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setEmailForConfirmation(values.email);
    try {
      await api.post('/auth/forgot-password', { email: values.email });
    } catch {
      // Intentionally ignore errors: do not reveal account existence.
    }
    setSubmitted(true);
    toast.success('If an account exists for that email, a reset link has been sent.');
  });

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-sm space-y-6 text-center">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="font-medium">{emailForConfirmation}</span>,
            we have sent a password reset link.
          </p>
          <p className="text-xs text-muted-foreground">
            Please check your inbox and spam folder.
          </p>
        </header>

        <Button asChild className="w-full">
          <Link href={routes.login}>Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send you a reset link.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner label={null} />}
            {form.formState.isSubmitting ? 'Sending reset link…' : 'Send reset link'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href={routes.login} className="text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
