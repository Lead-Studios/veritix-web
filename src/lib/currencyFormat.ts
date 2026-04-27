// FE-093: Normalized currency formatting for dashboard and event-management flows

export type SupportedCurrency = "NGN" | "USD" | "ETH";

const FORMATTERS: Record<SupportedCurrency, Intl.NumberFormat> = {
  NGN: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  ETH: new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 }),
};

export function formatCurrency(amount: number, currency: SupportedCurrency): string {
  if (currency === "ETH") return `${FORMATTERS.ETH.format(amount)} ETH`;
  return FORMATTERS[currency].format(amount);
}

export const DEFAULT_CURRENCY: SupportedCurrency = "NGN";