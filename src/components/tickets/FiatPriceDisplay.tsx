"use client";

import { useEffect, useState } from "react";

interface FiatPriceDisplayProps {
  xlmAmount: number;
  currency?: string;
}

const FIAT_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  NGN: "₦",
};

export function FiatPriceDisplay({ xlmAmount, currency = "USD" }: FiatPriceDisplayProps) {
  const [fiatPrice, setFiatPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrice() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.stellar.expert/ticker?pair=XLM/${currency}`
        );
        if (!res.ok) throw new Error("Price fetch failed");
        const data = await res.json();
        if (!cancelled && data?.price) {
          setFiatPrice(xlmAmount * Number(data.price));
        }
      } catch {
        if (!cancelled) setFiatPrice(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [xlmAmount, currency]);

  if (loading && fiatPrice === null) return null;

  if (fiatPrice === null) return null;

  const symbol = FIAT_SYMBOLS[currency] ?? currency + " ";

  return (
    <span className="text-xs text-gray-500">
      ≈ {symbol}
      {fiatPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
