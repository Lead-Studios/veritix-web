"use client";

import { useCallback, useState } from "react";
import {
  isConnected,
  getPublicKey,
  signTransaction,
} from "@stellar/freighter-api";
import {
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
} from "@stellar/stellar-sdk";

export type PaymentStatus = "idle" | "signing" | "submitting" | "confirmed" | "failed";

export interface FreighterPaymentResult {
  status: PaymentStatus;
  txHash?: string;
  error?: string;
}

interface FreighterPaymentParams {
  destination: string;
  amount: string;
  memo?: string;
  network?: "testnet" | "mainnet";
}

const NETWORK_PASSPHRASE: Record<string, string> = {
  testnet: Networks.TESTNET,
  mainnet: Networks.PUBLIC,
};

const HORIZON_URL: Record<string, string> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
};

async function getAccountSequence(publicKey: string, horizon: string): Promise<string> {
  const res = await fetch(`${horizon}/accounts/${publicKey}`);
  if (!res.ok) throw new Error("Failed to fetch account details");
  const data = await res.json();
  return data.sequence;
}

async function submitTransaction(
  signedXdr: string,
  horizon: string
): Promise<string> {
  const res = await fetch(`${horizon}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ tx: signedXdr }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.extras?.result_codes?.transaction ?? "Transaction submission failed");
  }
  return data.hash;
}

export function useFreighterPayment() {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const sendPayment = useCallback(
    async ({
      destination,
      amount,
      memo,
      network = "testnet",
    }: FreighterPaymentParams): Promise<FreighterPaymentResult> => {
      setStatus("signing");
      setTxHash(undefined);
      setError(undefined);

      try {
        const connected = await isConnected();
        if (!connected) throw new Error("Freighter wallet is not connected");

        const publicKey = await getPublicKey();
        const passphrase = NETWORK_PASSPHRASE[network];
        const horizon = HORIZON_URL[network];

        const sequence = await getAccountSequence(publicKey, horizon);

        const transaction = new TransactionBuilder(
          { accountId: () => publicKey, sequenceNumber: () => sequence },
          { fee: BASE_FEE, networkPassphrase: passphrase }
        )
          .addOperation(
            Operation.payment({
              destination,
              asset: Asset.native(),
              amount,
            })
          );

        if (memo) {
          transaction.addMemo(
            // @ts-expect-error - Memo.text is a valid Stellar SDK memo type
            { type: "MEMO_TEXT", value: memo }
          );
        }

        transaction.setTimeout(30);
        const builtTx = transaction.build();

        setStatus("signing");
        const signedXdr = await signTransaction(builtTx.toXDR(), {
          networkPassphrase: passphrase,
        });

        setStatus("submitting");
        const hash = await submitTransaction(signedXdr, horizon);

        setStatus("confirmed");
        setTxHash(hash);

        return { status: "confirmed", txHash: hash };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Payment failed";
        setStatus("failed");
        setError(msg);
        return { status: "failed", error: msg };
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(undefined);
    setError(undefined);
  }, []);

  return { sendPayment, status, txHash, error, reset };
}
