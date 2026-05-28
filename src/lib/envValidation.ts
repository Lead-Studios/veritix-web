// FE-122: Validate NEXT_PUBLIC_STELLAR_NETWORK at build time

const VALID_STELLAR_NETWORKS = ["testnet", "mainnet"] as const;
type StellarNetwork = (typeof VALID_STELLAR_NETWORKS)[number];

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_STELLAR_NETWORK",
] as const;

export function validateEnvironment(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Check .env.example for the full list of required variables."
    );
  }

  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK;
  if (!VALID_STELLAR_NETWORKS.includes(network as StellarNetwork)) {
    throw new Error(
      `Invalid NEXT_PUBLIC_STELLAR_NETWORK value: "${network}". ` +
        `Must be one of: ${VALID_STELLAR_NETWORKS.join(", ")}.`
    );
  }
}

export function getStellarNetwork(): StellarNetwork {
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK as StellarNetwork;
  return VALID_STELLAR_NETWORKS.includes(network) ? network : "testnet";
}
