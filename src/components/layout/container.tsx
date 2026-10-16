import * as React from 'react';
import { cn } from '@/lib/utils';

/** Constrains content to the app's max width and applies the page gutter. */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}
