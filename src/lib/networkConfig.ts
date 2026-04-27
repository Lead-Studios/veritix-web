// FE-079: Stellar-aligned blockchain network configuration
// Replaces Ethereum/Polygon/Solana options with Stellar-first positioning.

export type SupportedNetwork = "stellar-mainnet" | "stellar-testnet";

export const NETWORK_OPTIONS: { value: SupportedNetwork; label: string; description: string }[] = [
  {
    value: "stellar-mainnet",
    label: "Stellar Mainnet",
    description: "Production network — tickets are issued on the live Stellar ledger.",
  },
  {
    value: "stellar-testnet",
    label: "Stellar Testnet",
    description: "Test network — use this for development and testing only.",
  },
];

export const DEFAULT_NETWORK: SupportedNetwork = "stellar-testnet";