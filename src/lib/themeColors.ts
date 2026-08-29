/**
 * JS-accessible mirror of the brand color tokens defined in
 * `tailwind.config.js` (`theme.extend.colors`). Use these constants instead
 * of hardcoding hex strings in places that cannot consume a Tailwind class
 * directly - e.g. chart library props (Recharts `fill`/`stroke`/`stopColor`),
 * inline `style` objects, or SVG attributes.
 *
 * Keep these values in sync with `tailwind.config.js` if the design tokens
 * ever change.
 */
export const THEME_COLORS = {
  /** Matches the `brand-primary` Tailwind token. */
  brandPrimary: '#4D21FF',
  /** Matches the `brand-accent` Tailwind token. */
  brandAccent: '#21D4FF',
  /** Matches the `surface-dark` Tailwind token. */
  surfaceDark: '#101428',
} as const;
