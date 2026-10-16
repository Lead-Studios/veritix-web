const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true' || process.env.BUNDLE_ANALYZE === 'true',
  // Never try to open a browser in a pull-request runner.
  openAnalyzer: process.env.CI !== 'true',
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Emit `.next/standalone/server.js`. The production stage of the Dockerfile copies
  // that directory and runs `node server.js`, so the build must produce it.
  output: 'standalone',
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.veritix.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

/**
 * `next-pwa@5.6.0` is unmaintained and only generates a service worker under
 * webpack, so it stays out of the default build: the `require` below is lazy and
 * the only caller is the opt-in `build:pwa` script, which passes `--webpack`
 * alongside `ENABLE_PWA=true`. A plain `next build` (Turbopack) never loads it.
 */
const pwaEnabled = process.env.NODE_ENV === 'production' && process.env.ENABLE_PWA === 'true';
const withPwa = pwaEnabled
  ? require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV !== 'production',
      buildExcludes: [/middleware-manifest\.json$/],
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/verify'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'veritix-ticket-verification',
            networkTimeoutSeconds: 3,
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
          },
        },
        {
          urlPattern: ({ url }) =>
            url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/icons'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'veritix-static-assets',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    })
  : (config) => config;

const withSentryConfig = require('@sentry/nextjs/withSentryConfig');

/** @type {import('next').NextConfig} */
module.exports = withSentryConfig(withBundleAnalyzer(withPwa(nextConfig)), {
  sourcemaps: { ignoreBuildErrors: true },
  // Source-map upload is opt-in; a missing token must not make a build noisy.
  silent: !process.env.SENTRY_AUTH_TOKEN,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
});
