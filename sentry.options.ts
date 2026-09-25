import * as Sentry from '@sentry/nextjs';

type InitOptions = NonNullable<Parameters<typeof Sentry.init>[0]>;
type SentryEvent = Parameters<NonNullable<InitOptions['beforeSend']>>[0];

/**
 * Shared Sentry defaults for browser, Node, and edge runtimes.
 *
 * VeriTix handles wallet addresses, email addresses, and ticket payloads. Keep
 * the integration useful for diagnostics without sending those values to a
 * third party by default: request bodies, cookies, query strings, and the
 * auto-collected user object are dropped before an event leaves the app.
 */
export function getSentryOptions(): InitOptions {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: process.env.NODE_ENV === 'production' && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    profilesSampleRate: 0,
    sendDefaultPii: false,
    maxBreadcrumbs: 20,
    beforeSend(event: SentryEvent) {
      if (event.request) {
        delete event.request.data;
        delete event.request.cookies;
        delete event.request.query_string;
      }
      delete event.user;
      return event;
    },
  };
}
