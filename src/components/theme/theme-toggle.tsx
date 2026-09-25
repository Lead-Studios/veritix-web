'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, type Theme } from '@/components/theme/theme-provider';
import { cn } from '@/lib/utils';

const OPTIONS: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

/**
 * A radiogroup has one tab stop and arrow-key navigation. Three buttons in the
 * tab sequence with no arrow handling is a tablist that behaves like neither.
 * `distinguishingLabel` exists because the toggle is rendered on the home page
 * and in the app topbar at the same time, and two identically-labelled
 * radiogroups on one page are ambiguous.
 */
export function ThemeToggle({
  className,
  distinguishingLabel,
}: {
  className?: string;
  distinguishingLabel?: string;
}) {
  const { theme, setTheme } = useTheme();
  const groupRef = React.useRef<HTMLDivElement>(null);
  // The checked option is the tab stop; the rest are reached with arrow keys.
  const selectedIndex = Math.max(
    0,
    OPTIONS.findIndex((option) => option.value === theme),
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const offset =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;
    if (offset === 0) return;

    event.preventDefault();
    const next = (selectedIndex + offset + OPTIONS.length) % OPTIONS.length;
    const nextOption = OPTIONS[next];
    setTheme(nextOption.value);

    // Move focus with the selection, as a radiogroup is expected to.
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    buttons?.[next]?.focus();
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={
        distinguishingLabel ? `Colour theme (${distinguishingLabel})` : 'Colour theme'
      }
      onKeyDown={onKeyDown}
      className={cn('inline-flex items-center gap-0.5 rounded-md border border-border p-0.5', className)}
    >
      {OPTIONS.map(({ value, label, Icon }, index) => (
        <Button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          tabIndex={index === selectedIndex ? 0 : -1}
          variant={theme === value ? 'secondary' : 'ghost'}
          size="icon"
          className="size-7"
          onClick={() => setTheme(value)}
        >
          <Icon aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}
