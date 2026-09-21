/**
 * Tailwind v3 pipeline. The previous config loaded @tailwindcss/postcss, which
 * is the v4 plugin, against tailwindcss@3 — the two are not interchangeable and
 * the v4 plugin does not understand the `@tailwind` directives in global.css.
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
