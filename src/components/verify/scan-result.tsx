'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export type ScanResultKind = 'valid' | 'already_used' | 'invalid' | 'error';

export interface ScanResult {
  kind: ScanResultKind;
  message: string;
  usedAt?: string;
  ticketId?: string;
}

const AUTO_CLEAR_AFTER_MS = 3000;

const RESULT_STYLE: Record<
  ScanResultKind,
  { title: string; className: string; Icon: typeof CheckCircle2 }
> = {
  valid: {
    title: 'Valid — let them in',
    className: 'border-success bg-success text-success-foreground',
    Icon: CheckCircle2,
  },
  already_used: {
    title: 'Already used',
    className: 'border-warning bg-warning text-warning-foreground',
    Icon: AlertTriangle,
  },
  invalid: {
    title: 'Invalid ticket',
    className: 'border-destructive bg-destructive text-destructive-foreground',
    Icon: XCircle,
  },
  error: {
    title: 'Could not check ticket',
    className: 'border-border bg-muted text-foreground',
    Icon: AlertTriangle,
  },
};

export function ScanResultDisplay({
  result,
  onDismiss,
}: {
  result: ScanResult;
  onDismiss: () => void;
}) {
  const { title, className, Icon } = RESULT_STYLE[result.kind];

  React.useEffect(() => {
    const timeout = setTimeout(onDismiss, AUTO_CLEAR_AFTER_MS);
    return () => clearTimeout(timeout);
  }, [onDismiss, result]);

  return (
    <div
      className={cn('w-full rounded-lg border-2 p-5 sm:p-6', className)}
      data-result={result.kind}
    >
      <div className="flex items-start gap-4">
        <Icon className="h-12 w-12 shrink-0 sm:h-16 sm:w-16" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-2xl font-bold sm:text-3xl">{title}</p>
          <p className="text-lg">{result.message}</p>
          {result.kind === 'already_used' && result.usedAt && (
            <p className="text-sm">First scanned {formatDateTime(result.usedAt)}.</p>
          )}
          {result.kind === 'valid' && result.ticketId && (
            <p className="text-sm">Ticket {result.ticketId}</p>
          )}
        </div>
      </div>
      <Button variant="outline" size="sm" className="mt-4 text-foreground" onClick={onDismiss}>
        Scan next ticket
      </Button>
    </div>
  );
}
