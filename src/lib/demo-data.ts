/**
 * Whether the seeded demo fixtures may answer API requests.
 *
 * The app has no database or indexer wired up yet, so the events catalogue,
 * ticket store, and analytics history are generated in memory. Serving those
 * numbers in production would present invented events and sales as if they were
 * real, so the fixtures are opt-in outside development:
 *
 *   USE_DEMO_DATA=true   -> always on   (explicit opt-in)
 *   USE_DEMO_DATA=false  -> always off  (explicit opt-out)
 *   unset                -> on in development and tests, off in production
 *
 * The routes that can serve a fixture label their responses when this is on, so
 * a caller is never left guessing whether it is looking at real data.
 */
export function demoDataEnabled(): boolean {
  if (process.env.USE_DEMO_DATA === 'true') return true;
  if (process.env.USE_DEMO_DATA === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

/** Response body fields marking a fixture-backed payload, empty when off. */
export function demoPayload(): { demo?: true } {
  return demoDataEnabled() ? { demo: true } : {};
}

/** Response headers marking a fixture-backed payload, empty when off. */
export function demoHeaders(): Record<string, string> {
  return demoDataEnabled() ? { 'X-Demo-Data': 'true' } : {};
}
