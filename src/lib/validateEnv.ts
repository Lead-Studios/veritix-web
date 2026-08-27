const VALID_STELLAR_NETWORKS = ['testnet', 'mainnet'] as const;
type StellarNetwork = (typeof VALID_STELLAR_NETWORKS)[number];

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_STELLAR_NETWORK',
  'AUTH_SECRET',
] as const;

const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SENTRY_DSN',
  'SENTRY_AUTH_TOKEN',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_CONTACT_ADDRESS',
  'NEXT_PUBLIC_CONTACT_EMAIL',
  'NEXT_PUBLIC_CONTACT_PHONE',
  'NEXT_PUBLIC_SOCIAL_GITHUB',
  'NEXT_PUBLIC_SOCIAL_LINKEDIN',
  'NEXT_PUBLIC_SOCIAL_TWITTER',
  'NEXT_PUBLIC_NEWSLETTER_ENDPOINT',
  'JWT_SECRET',
] as const;

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateEnvironment(): void {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  for (const key of OPTIONAL_ENV_VARS) {
    if (!process.env[key]) {
      console.warn(`[VeriTix] Missing optional env var: ${key}`);
    }
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl || !isValidUrl(apiBaseUrl)) {
    throw new Error(
      `Invalid NEXT_PUBLIC_API_BASE_URL value: "${apiBaseUrl ?? ''}". Please provide a valid http(s) URL.`,
    );
  }

  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK;
  if (!VALID_STELLAR_NETWORKS.includes(network as StellarNetwork)) {
    throw new Error(
      `Invalid NEXT_PUBLIC_STELLAR_NETWORK value: "${network}". Must be one of: ${VALID_STELLAR_NETWORKS.join(', ')}.`,
    );
  }
}

export function getStellarNetwork(): StellarNetwork {
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK as StellarNetwork;
  return VALID_STELLAR_NETWORKS.includes(network) ? network : 'testnet';
}
