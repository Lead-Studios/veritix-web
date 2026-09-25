import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number;
  icon?: React.ReactNode;
}

/**
 * A label, a value, and an optional change since last period.
 *
 * Emits `<dt>`/`<dd>` so it can sit inside a `<dl>`: the label/value pairing is
 * a real relationship, and a screen reader announces the pair together instead
 * of two unrelated paragraphs.
 */
export function StatCard({ label, value, delta, icon }: StatCardProps) {
  const isPositive = (delta ?? 0) >= 0;

  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="text-2xl font-semibold">{value}</dd>
        {delta !== undefined && (
          <dd
            className={cn(
              'flex items-center gap-1 text-xs',
              isPositive ? 'text-success' : 'text-destructive',
            )}
          >
            {/* The direction was carried by the icon and by colour alone. Both
                are unavailable to a screen reader and to anyone who cannot
                distinguish red from green, so it is stated in words. */}
            {isPositive ? (
              <ArrowUp className="size-3" aria-hidden="true" />
            ) : (
              <ArrowDown className="size-3" aria-hidden="true" />
            )}
            <span className="sr-only">{isPositive ? 'up' : 'down'} </span>
            {Math.abs(delta)}%
          </dd>
        )}
      </div>
      {/* Decorative by default: an unlabelled icon here would be announced as
          an unlabelled graphic. Consumers pass their own with a label. */}
      <div aria-hidden={icon ? undefined : true}>{icon}</div>
    </Card>
  );
}
