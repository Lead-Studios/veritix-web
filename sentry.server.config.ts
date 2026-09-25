import * as Sentry from '@sentry/nextjs';
import { getSentryOptions } from './sentry.options';

// Server diagnostics are opt-in and never initialize during local development.
if (process.env.NODE_ENV === 'production') {
  Sentry.init(getSentryOptions());
}
