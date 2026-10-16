import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/format';

// Amounts are minor units (cents) so they can go through formatCurrency
// instead of a hand-rolled `$${amount.toLocaleString()}`.
const PAYOUTS = [
  { ref: 'ESC-001', amount: 120_000, status: 'Settled', date: '2026-09-10' },
  { ref: 'ESC-002', amount: 85_000, status: 'Escrowed', date: '' },
  { ref: 'ESC-003', amount: 340_000, status: 'Settled', date: '2026-09-18' },
  { ref: 'ESC-004', amount: 96_000, status: 'Escrowed', date: '' },
] as const;

/** Raw `bg-green-100`/`bg-yellow-100` pairs were unreadable in dark mode. */
const STATUS_VARIANT = {
  Settled: 'success',
  Escrowed: 'warning',
} as const;

export default function PayoutsPage() {
  const totalEscrowed = PAYOUTS.filter((p) => p.status === 'Escrowed').reduce(
    (sum, p) => sum + p.amount,
    0,
  );

  return (
    // A <div>, not a second <main>: the protected layout already renders
    // <main id="main">, and a nested main is two landmarks where there should
    // be one. The layout also supplies the page padding.
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payouts</h1>
        <p className="text-sm text-muted-foreground">
          Total still held in escrow:{' '}
          <span className="font-medium text-foreground">{formatCurrency(totalEscrowed)}</span>
        </p>
      </div>
      <div className="rounded-lg border border-border">
        <Table>
          {/* Without a caption the table is announced as a bare grid, and the
              header row repeats "Escrow Ref Amount Status…" on every cell. */}
          <TableCaption className="sr-only">Escrowed and settled payouts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Escrow Ref</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Settlement Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAYOUTS.map((p) => (
              <TableRow key={p.ref}>
                <TableCell data-label="Escrow Ref" className="font-mono">
                  {p.ref}
                </TableCell>
                <TableCell data-label="Amount">{formatCurrency(p.amount)}</TableCell>
                <TableCell data-label="Status">
                  <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                </TableCell>
                <TableCell data-label="Settlement Date" className="text-muted-foreground">
                  {/* An empty cell announced as "blank" is indistinguishable
                      from a rendering bug; say why it is empty. */}
                  {p.date ? formatDate(p.date) : 'Pending'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
