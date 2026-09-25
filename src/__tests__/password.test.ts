import { describe, expect, it } from 'vitest';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_RULES,
  passwordChangeSchema,
  passwordPolicyError,
  passwordSchema,
} from '@/lib/password';

const VALID = 'Correct-horse-9!';

/** First message for a field, or undefined when the value is accepted. */
function messagesFor(values: unknown, field: 'currentPassword' | 'newPassword' | 'confirmPassword') {
  const result = passwordChangeSchema.safeParse(values);
  if (result.success) return [];
  return result.error.issues.filter((issue) => issue.path[0] === field).map((i) => i.message);
}

describe('passwordPolicyError', () => {
  it('accepts a password that satisfies every rule', () => {
    expect(passwordPolicyError(VALID)).toBeNull();
  });

  it('names the first rule still unmet, in rule order', () => {
    expect(passwordPolicyError('short')).toBe(`At least ${PASSWORD_MIN_LENGTH} characters`);
    expect(passwordPolicyError('alllowercase9!')).toBe('An uppercase letter');
    expect(passwordPolicyError('ALLUPPERCASE9!')).toBe('A lowercase letter');
    expect(passwordPolicyError('NoDigitsHere!!')).toBe('A number');
    expect(passwordPolicyError('NoSymbols12345')).toBe('A symbol');
  });

  it('reports the same rules the schema enforces', () => {
    // Each sample satisfies every rule except the one under test, so a rule that
    // quietly drifted from the schema would be caught here.
    const samples: Record<string, string> = {
      length: 'Ab1!x',
      lowercase: 'ABCDEFGHIJKL1!',
      uppercase: 'abcdefghijkl1!',
      number: 'Abcdefghijkl!',
      symbol: 'Abcdefghijkl1',
    };

    for (const rule of PASSWORD_RULES) {
      const sample = samples[rule.id];
      expect(rule.test(sample), `${rule.id} should reject its own sample`).toBe(false);
      expect(passwordPolicyError(sample)).toBe(rule.label);
    }
  });
});

describe('passwordSchema', () => {
  it('rejects anything under the minimum length', () => {
    expect(passwordSchema.safeParse(VALID.slice(0, PASSWORD_MIN_LENGTH - 1)).success).toBe(false);
    expect(passwordSchema.safeParse(VALID).success).toBe(true);
  });

  it('caps the length, so a paste cannot be used to overflow a column', () => {
    expect(passwordSchema.safeParse('aB1!'.repeat(PASSWORD_MAX_LENGTH)).success).toBe(false);
  });
});

describe('passwordChangeSchema', () => {
  it('requires the current password', () => {
    expect(
      messagesFor({ currentPassword: '', newPassword: VALID, confirmPassword: VALID }, 'currentPassword'),
    ).toEqual(['Enter your current password']);
  });

  it('enforces the shared policy on the new password', () => {
    const messages = messagesFor(
      { currentPassword: 'old', newPassword: 'weak', confirmPassword: 'weak' },
      'newPassword',
    );

    // The schema reports every rule that failed; the form shows the first, which
    // is the length one because zod checks it before the regexes.
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]).toBe('Use at least 12 characters');
  });

  it('attaches a mismatch to the confirmation, not the new password', () => {
    const values = { currentPassword: 'old', newPassword: VALID, confirmPassword: `${VALID}x` };

    expect(messagesFor(values, 'confirmPassword')).toEqual(['The passwords do not match']);
    // The new password itself is fine — it is the repeat that is wrong.
    expect(messagesFor(values, 'newPassword')).toEqual([]);
  });

  it('accepts a matching, policy-compliant set', () => {
    const result = passwordChangeSchema.safeParse({
      currentPassword: 'old-password',
      newPassword: VALID,
      confirmPassword: VALID,
    });
    expect(result.success).toBe(true);
  });

  it('does not complain about a mismatch while the confirmation is still empty', () => {
    expect(
      messagesFor({ currentPassword: 'old', newPassword: VALID, confirmPassword: '' }, 'confirmPassword'),
    ).toEqual(['Confirm your new password']);
  });
});
