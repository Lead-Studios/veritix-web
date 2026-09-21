/**
 * Next.js 16 runs Turbopack by default. The previous config declared a custom
 * `webpack` block (only to alias `@` -> src, which tsconfig `paths` already
 * handles) and that combination is a hard error under Turbopack.
 *
 * PWA (next-pwa) and bundle analysis (@next/bundle-analyzer) were also wrapped
 * around this config while neither package was declared in package.json. Both
 * are tracked as backlog issues and should return with their dependencies.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Empty object is enough: the `@` alias resolves through tsconfig paths.
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.veritix.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

module.exports = nextConfig;
