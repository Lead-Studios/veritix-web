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

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn('inline-flex items-center gap-0.5 rounded-md border border-border p-0.5', className)}
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <Button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
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
