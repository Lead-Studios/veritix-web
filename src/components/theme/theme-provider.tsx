'use client';

import * as React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** The user's stored preference. */
  theme: Theme;
  /** What is actually rendered right now, after resolving `system`. */
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'veritix-theme';

/**
 * The stored preference is held in a tiny external store rather than component
 * state. That lets useSyncExternalStore read it during hydration without a
 * setState-in-effect, which React 19 flags as a cascading render.
 */
const listeners = new Set<() => void>();
let cachedTheme: Theme | null = null;

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function getThemeSnapshot(): Theme {
  if (cachedTheme !== null) return cachedTheme;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    cachedTheme = isTheme(stored) ? stored : 'system';
  } catch {
    // Private mode or blocked storage — follow the OS instead.
    cachedTheme = 'system';
  }
  return cachedTheme;
}

/** The server cannot know the preference, so it always renders the neutral default. */
const getThemeServerSnapshot = (): Theme => 'system';

function subscribeToTheme(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function writeTheme(theme: Theme) {
  cachedTheme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The preference simply will not persist; rendering is unaffected.
  }
  for (const listener of listeners) listener();
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  // Derived, not stored — no effect needed to keep it in sync.
  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  // Writing to the document is a genuine external side effect, so it belongs here.
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme: writeTheme }),
    [theme, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

/**
 * Applies the stored theme before first paint so a dark-mode user never sees a
 * white flash. Rendered as a blocking inline script in the document head.
 */
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var dark = stored === 'dark' || ((!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`;
