import { EVENTS } from '@/lib/events';
import type { VeritixEvent } from '@/types';

/**
 * Read model for the organizer payouts API.
 *
 * Same caveat as `@/lib/events`: this app has no database or indexer wired up
 * yet, so the rows below are derived from the event fixture. `queryPayouts` is
 * the only function that has to change when the real escrow ledger lands — the
 * route and the page stay as they are.
 *
 * Every read requires an `ownerId` and filters by it before anything is
 * returned, so a caller cannot ask for a payout that is not theirs to see.
 */

export type PayoutStatus = 'Settled' | 'Escrowed';

export interface Payout {
  /** Escrow reference, stable for the life of the event. */
  ref: string;
  eventId: string;
  eventTitle: string;
  /** Ticket revenue currently held or released, in integer minor units. */
  amountMinor: number;
  status: PayoutStatus;
  currency: string;
  /** ISO day the escrow settled, or an empty string while it is still held. */
  settledAt: string;
}

export interface PayoutsSnapshot {
  items: Payout[];
  /** Sum of every row still `Escrowed`, in minor units. */
  totalEscrowedMinor: number;
  currency: string;
}

/** Everything sold against the event, i.e. the amount its escrow holds. */
function grossMinor(event: VeritixEvent): number {
  return event.tiers.reduce((total, tier) => total + tier.priceMinor * tier.quantitySold, 0);
}

/**
 * Escrowed and settled payouts for one organizer.
 *
 * An event that has sold nothing has no escrow to report, so it is left out —
 * showing a $0.00 row for every draft would bury the real ones. Completed
 * events have settled; anything still live is escrowed.
 */
export function queryPayouts(ownerId: string): PayoutsSnapshot {
  const items = EVENTS.flatMap((event, index): Payout[] => {
    if (event.organizer.id !== ownerId) return [];

    const amountMinor = grossMinor(event);
    if (amountMinor <= 0) return [];

    const settled = event.status === 'completed';

    return [
      {
        // The fixture's position gives each event a stable reference. The real
        // ledger will carry its own id.
        ref: `ESC-${String(index + 1).padStart(3, '0')}`,
        eventId: event.id,
        eventTitle: event.title,
        amountMinor,
        status: settled ? 'Settled' : 'Escrowed',
        currency: event.tiers[0]?.currency ?? 'USD',
        settledAt: settled ? event.endsAt.slice(0, 10) : '',
      },
    ];
  });

  const totalEscrowedMinor = items
    .filter((payout) => payout.status === 'Escrowed')
    .reduce((sum, payout) => sum + payout.amountMinor, 0);

  return {
    items,
    totalEscrowedMinor,
    currency: items[0]?.currency ?? 'USD',
  };
}
