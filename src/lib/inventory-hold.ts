const HOLD_WINDOW_MS = 10 * 60_000;

interface Hold {
  tierId: string;
  quantity: number;
  expiresAt: number;
}

const activeHolds = new Map<string, Hold>();

/** Reserves quantity for a checkout session for a documented window. */
export function reserveHold(sessionId: string, tierId: string, quantity: number): Hold {
  const hold: Hold = { tierId, quantity, expiresAt: Date.now() + HOLD_WINDOW_MS };
  activeHolds.set(sessionId, hold);
  return hold;
}

export function releaseHold(sessionId: string): void {
  activeHolds.delete(sessionId);
}

export function isHoldValid(sessionId: string): boolean {
  const hold = activeHolds.get(sessionId);
  return !!hold && hold.expiresAt > Date.now();
}

export function remainingHoldMs(sessionId: string): number {
  const hold = activeHolds.get(sessionId);
  return hold ? Math.max(0, hold.expiresAt - Date.now()) : 0;
}
