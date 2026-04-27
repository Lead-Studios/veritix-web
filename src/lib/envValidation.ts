// FE-100: Environment validation for deployment reliability
// Validates required environment variables before the app starts.

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_STELLAR_NETWORK",
] as const;

export function validateEnvironment(): void {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key]
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
      "Check .env.example for the full list of required variables."
    );
  }
}