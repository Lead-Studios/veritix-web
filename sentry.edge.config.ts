import * as Sentry from '@sentry/nextjs';
import { getSentryOptions } from './sentry.options';

// Edge diagnostics use the same production gate and privacy scrubbing.
if (process.env.NODE_ENV === 'production') {
  Sentry.init(getSentryOptions());
}
