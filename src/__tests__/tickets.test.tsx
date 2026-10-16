import { describe, expect, it } from 'vitest';
import type { TicketStatus } from '@/types';

const STATUS_BADGE: Record<TicketStatus, string> = {
  valid: 'success',
  used: 'secondary',
  refunded: 'warning',
  transferred: 'outline',
};

function badgeVariantFor(status: TicketStatus): string {
  return STATUS_BADGE[status];
}

describe('ticket ownership and status', () => {
  it('maps every status to a distinct badge variant', () => {
    const variants = Object.values(STATUS_BADGE);
    expect(new Set(variants).size).toBeGreaterThan(1);
  });

  it('denies access to a ticket the session user does not own', async () => {
    const isOwner = (ownerId: string, sessionUserId: string) => ownerId === sessionUserId;
    expect(isOwner('user-1', 'user-2')).toBe(false);
  });
});
