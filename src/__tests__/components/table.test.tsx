import { render, screen } from '@testing-library/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

describe('Table', () => {
  it('renders semantic markup with caption and data-labels', () => {
    render(
      <Table>
        <TableCaption>Test table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell data-label="Name">Item</TableCell>
            <TableCell data-label="Value">123</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Test table')).toBeInTheDocument();
    expect(screen.getByText('Item')).toHaveAttribute('data-label', 'Name');
  });
});
