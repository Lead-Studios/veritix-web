'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { PASSWORD_RULES, passwordSchema, passwordPolicyError } from '@/lib/password';

const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required')
      .max(120, 'Name must be at most 120 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z
      .string({ required_error: 'Confirm your password' })
      .trim()
      .min(1, 'Confirm your password'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .superRefine((values, ctx) => {
    if (values.confirmPassword.length > 0 && values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'The passwords do not match',
      });
    }
  });

type RegisterValues = z.infer<typeof registerSchema>;

/**
 * Registration page with name, email, password, confirmation and terms acceptance.
 * Shows the PASSWORD_RULES checklist and field-level error messages on submit.
 */
export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as any,
    },
    mode: 'onBlur',
  });

  const password = form.watch('password');
  const passwordError = passwordPolicyError(password);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        acceptTerms: true,
      });

      toast.success('Account created. You can sign in now.');
      router.replace(routes.login);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not create your account. Try again.',
      );
    }
  });

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your details to get started.</p>
      </header>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    disabled={form.formState.isSubmitting}
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
                <FormLabel required>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ul id="password-rules" aria-label="Password requirements" className="space-y-1">
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(password);
              return (
                <li
                  key={rule.id}
                  className={cn(
                    'flex items-center gap-2 text-sm',
                    met ? 'text-success' : 'text-muted-foreground',
                  )}
                >
                  {met ? <Check className="size-4 shrink-0" aria-hidden="true" /> : <X className="size-4 shrink-0" aria-hidden="true" />}
                  <span>{rule.label}</span>
                  <span className="sr-only">{met ? ' — met' : ' — not met yet'}</span>
                </li>
              );
            })}
          </ul>

          {password.length > 0 && passwordError !== null && (
            <p role="status" className="text-sm text-muted-foreground">
              Still to do: {passwordError.toLowerCase()}.
            </p>
          )}

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    disabled={form.formState.isSubmitting}
                    aria-describedby="terms-description"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    I accept the{' '}
                    <Link href={routes.terms} className="underline underline-offset-4">
                      terms and conditions
                    </Link>
                  </FormLabel>
                  <p id="terms-description" className="text-xs text-muted-foreground">
                    You must accept to create an account.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner label={null} />}
            {form.formState.isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href={routes.login} className="text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
