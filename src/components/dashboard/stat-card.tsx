import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, delta, icon }: StatCardProps) {
  const isPositive = (delta ?? 0) >= 0;

  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {delta !== undefined && (
          <p className={cn('flex items-center gap-1 text-xs', isPositive ? 'text-success' : 'text-destructive')}>
            {isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
            {Math.abs(delta)}%
          </p>
        )}
      </div>
      {icon}
    </Card>
  );
}
