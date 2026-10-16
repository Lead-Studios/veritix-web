import { z } from 'zod';

/**
 * The platform's password policy, in one place.
 *
 * Registration and the settings password form must never drift apart — a user
 * who can set a password at signup must not be able to set a weaker one later,
 * and the weaker one would then be the one standing between them and their
 * account. Both forms import `passwordSchema` from here rather than restating
 * the rules, so there is exactly one definition to change.
 *
 * The policy is deliberately length-first, and the length is well past the
 * 8-character floor NIST recommends. Composition rules are kept only because
 * they meaningfully raise the cost of a guess against a reused password; they
 * are not a substitute for length.
 */

export const PASSWORD_MIN_LENGTH = 12;

export const PASSWORD_MAX_LENGTH = 128;

/**
 * Individual rules, listed so the UI can render the same checklist the schema
 * enforces. Keeping the labels next to the patterns is what stops the form
 * promising something the validator does not check.
 */
export const PASSWORD_RULES: ReadonlyArray<{ id: string; label: string; test: (value: string) => boolean }> = [
  {
    id: 'length',
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (value) => value.length >= PASSWORD_MIN_LENGTH,
  },
  { id: 'lowercase', label: 'A lowercase letter', test: (value) => /[a-z]/.test(value) },
  { id: 'uppercase', label: 'An uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { id: 'number', label: 'A number', test: (value) => /[0-9]/.test(value) },
  { id: 'symbol', label: 'A symbol', test: (value) => /[^A-Za-z0-9]/.test(value) },
] as const;

/**
 * Why the value is rejected, or `null` when it satisfies the policy. Errors are
 * returned in rule order so the message names the first thing still missing.
 */
export function passwordPolicyError(value: string): string | null {
  const failed = PASSWORD_RULES.find((rule) => !rule.test(value));
  return failed ? failed.label : null;
}

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters`)
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/[0-9]/, 'Include a number')
  .regex(/[^A-Za-z0-9]/, 'Include a symbol');

/**
 * A new password plus its confirmation.
 *
 * The confirmation is compared with `superRefine` rather than a field-level
 * check so the error attaches to the confirmation input, which is the field the
 * reader has to fix.
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .superRefine((values, ctx) => {
    if (values.confirmPassword.length > 0 && values.newPassword !== values.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'The passwords do not match',
      });
    }
  });

export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
