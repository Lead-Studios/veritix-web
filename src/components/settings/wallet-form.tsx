'use client';

import * as React from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { truncateAddress } from '@/lib/format';

/**
 * The parts of the Freighter extension API this form uses.
 *
 * Mirrors the detection in `checkout/payment-step.tsx`. Not imported from
 * there: that module is split out for the checkout bundle, and pulling from
 * it here would defeat that split for an unrelated page.
 */
interface FreighterProvider {
  getPublicKey(): Promise<string>;
}

function freighter(): FreighterProvider | null {
  if (typeof window === 'undefined') return null;

  const injected = window as unknown as {
    freighterApi?: FreighterProvider;
    freighter?: FreighterProvider;
  };

  return injected.freighterApi ?? injected.freighter ?? null;
}

/** A Stellar account address: leading `G` plus 55 base32 characters. Must
 * stay in sync with the shape the PATCH /api/user/wallet route accepts. */
const STELLAR_ADDRESS = /^G[A-Z2-7]{55}$/;

export interface WalletFormProps {
  /** The address payouts currently go to, or null if none is connected. */
  walletAddress: string | null;
  /** True when a payout is on-chain or queued for the current address. */
  hasPendingPayouts?: boolean;
  /** Called with the new address to connect or to replace the current one. */
  onConnect: (address: string) => Promise<void>;
  /** Called to remove the connected address entirely. */
  onDisconnect: () => Promise<void>;
}

/**
 * Connected wallet, in settings.
 *
 * Changing or removing the payout address while a payout is pending is
 * gated behind an extra checkbox: nothing about the risk can be caught by
 * the form field itself (a well-formed address that belongs to the wrong
 * account still passes validation), so the confirmation has to be a
 * separate, deliberate step rather than folded into the address field.
 */
export function WalletForm({
  walletAddress,
  hasPendingPayouts = false,
  onConnect,
  onDisconnect,
}: WalletFormProps) {
  const [editing, setEditing] = React.useState(walletAddress === null);
  const [draft, setDraft] = React.useState('');
  const [riskAcknowledged, setRiskAcknowledged] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const addressId = React.useId();
  const errorId = `${addressId}-error`;
  const riskId = `${addressId}-risk`;

  // Changing an address that's already set is the risky case; setting one
  // for the first time has nothing pending to disrupt.
  const isChange = walletAddress !== null;
  const needsAck = hasPendingPayouts && isChange;
  const trimmed = draft.trim();
  const validAddress = STELLAR_ADDRESS.test(trimmed);
  const canSubmit =
    validAddress &&
    trimmed !== walletAddress &&
    (!needsAck || riskAcknowledged) &&
    !pending;
  const canDisconnect = (!needsAck || riskAcknowledged) && !pending;

  const resetForm = () => {
    setDraft('');
    setRiskAcknowledged(false);
    setError(null);
  };

  const connectWithFreighter = async () => {
    const provider = freighter();
    if (!provider) {
      setError(
        'No Stellar wallet extension found. Install Freighter, or paste an address below.',
      );
      return;
    }

    setPending(true);
    setError(null);
    try {
      const address = await provider.getPublicKey();
      await onConnect(address);
      setEditing(false);
      resetForm();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'The wallet extension request failed.',
      );
    } finally {
      setPending(false);
    }
  };

  const submitAddress = async () => {
    if (!canSubmit) return;

    setPending(true);
    setError(null);
    try {
      await onConnect(trimmed);
      setEditing(false);
      resetForm();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The wallet could not be saved.');
    } finally {
      setPending(false);
    }
  };

  const disconnect = async () => {
    if (!canDisconnect) return;

    setPending(true);
    setError(null);
    try {
      await onDisconnect();
      resetForm();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'The wallet could not be disconnected.',
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Wallet className="size-5 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Payout wallet</p>
            {walletAddress ? (
              <p
                className="font-mono text-sm text-muted-foreground"
                title={walletAddress}
              >
                {truncateAddress(walletAddress)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No wallet connected</p>
            )}
          </div>
        </div>
        {!editing && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              {walletAddress ? 'Change' : 'Connect'}
            </Button>
            {walletAddress && (
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnect}
                disabled={pending}
                aria-busy={pending}
              >
                Disconnect
              </Button>
            )}
          </div>
        )}
      </div>

      {hasPendingPayouts && (
        <p className="text-sm text-warning">
          A payout is pending on this wallet. Changing or removing it won&apos;t affect
          that payout, but any new one will go to whatever address is connected when
          it&apos;s released.
        </p>
      )}

      {editing && (
        <div className="space-y-3 border-t border-border pt-4">
          <div className="space-y-1.5">
            <Label htmlFor={addressId}>Stellar address</Label>
            <Input
              id={addressId}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="G..."
              className="font-mono"
              aria-invalid={draft.length > 0 && !validAddress ? true : undefined}
              aria-describedby={error ? errorId : undefined}
            />
            {draft.length > 0 && !validAddress && (
              <p className="text-sm text-muted-foreground">
                That doesn&apos;t look like a Stellar account address.
              </p>
            )}
          </div>

          {needsAck && (
            <div className="flex items-start gap-2">
              <Checkbox
                id={riskId}
                checked={riskAcknowledged}
                onChange={(event) => setRiskAcknowledged(event.target.checked)}
              />
              <Label htmlFor={riskId} className="font-normal leading-snug">
                I understand a payout is pending and this change won&apos;t redirect it.
              </Label>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={connectWithFreighter}
              variant="secondary"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? 'Connecting…' : 'Connect with Freighter'}
            </Button>
            <Button onClick={submitAddress} disabled={!canSubmit} aria-busy={pending}>
              Save address
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setEditing(false);
                resetForm();
              }}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
