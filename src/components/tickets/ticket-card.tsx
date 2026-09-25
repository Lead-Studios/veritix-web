import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Ticket, TicketStatus } from '@/types';

const STATUS_VARIANT: Record<TicketStatus, 'success' | 'secondary' | 'warning' | 'outline'> = {
  valid: 'success',
  used: 'secondary',
  refunded: 'warning',
  transferred: 'outline',
};

interface TicketCardProps {
  ticket: Ticket;
  eventTitle: string;
  eventDate: string;
  tierName: string;
}

export function TicketCard({ ticket, eventTitle, eventDate, tierName }: TicketCardProps) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <p className="font-medium">{eventTitle}</p>
        <p className="text-sm text-muted-foreground">{eventDate} · {tierName}</p>
      </div>
      <Badge variant={STATUS_VARIANT[ticket.status]}>{ticket.status}</Badge>
    </Card>
  );
}
