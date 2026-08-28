'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseCommandPaletteOptions {
  /** Keyboard shortcut key (default: "k") */
  key?: string;
  /** Require Meta (Cmd on Mac, Win on Windows) */
  meta?: boolean;
  /** Require Ctrl */
  ctrl?: boolean;
}

/**
 * Manages open/close state for a command palette triggered by a keyboard shortcut.
 * Default: Cmd+K (Mac) / Ctrl+K (Windows/Linux).
 *
 * @example
 * const { isOpen, open, close, toggle } = useCommandPalette();
 * return <CommandPalette isOpen={isOpen} onClose={close} />;
 */
export function useCommandPalette(options: UseCommandPaletteOptions = {}) {
  const { key = 'k', meta = true, ctrl = true } = options;
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const matchesKey = e.key.toLowerCase() === key.toLowerCase();
      const matchesModifier = (meta && e.metaKey) || (ctrl && e.ctrlKey);

      if (matchesKey && matchesModifier) {
        e.preventDefault();
        toggle();
      }

      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, meta, ctrl, isOpen, toggle, close]);

  return { isOpen, open, close, toggle };
}
