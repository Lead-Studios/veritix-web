import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SplitEditor, type SplitRow } from '@/components/dashboard/split-editor';

const rows: SplitRow[] = [
  { walletAddress: '0xaaa', percentage: 60 },
  { walletAddress: '0xbbb', percentage: 40 },
];

/** Stateful wrapper so a test can re-render with the rows onChange produced. */
function Harness({ initial }: { initial: SplitRow[] }) {
  const [current, setCurrent] = useState(initial);
  return <SplitEditor rows={current} onChange={setCurrent} />;
}

describe('SplitEditor', () => {
  it('is controlled: editing a wallet address reports the updated rows', async () => {
    const onChange = vi.fn();
    render(<SplitEditor rows={rows} onChange={onChange} />);
    const user = userEvent.setup();

    const wallets = screen.getAllByPlaceholderText('0x...');
    expect(wallets).toHaveLength(2);

    await user.clear(wallets[0]);
    await user.type(wallets[0], '0xccc');

    expect(onChange).toHaveBeenLastCalledWith([
      { walletAddress: '0xccc', percentage: 60 },
      { walletAddress: '0xbbb', percentage: 40 },
    ]);
  });

  it('is controlled: editing a share reports the updated rows', async () => {
    const onChange = vi.fn();
    render(<SplitEditor rows={rows} onChange={onChange} />);
    const user = userEvent.setup();

    const shares = screen.getAllByLabelText(/Share \d+ \(%\)/);
    expect(shares).toHaveLength(2);

    await user.clear(shares[1]);
    await user.type(shares[1], '50');

    expect(onChange).toHaveBeenLastCalledWith([
      { walletAddress: '0xaaa', percentage: 60 },
      { walletAddress: '0xbbb', percentage: 50 },
    ]);
  });

  it('adds a recipient row', async () => {
    const onChange = vi.fn();
    render(<SplitEditor rows={rows} onChange={onChange} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Add recipient' }));

    expect(onChange).toHaveBeenLastCalledWith([
      ...rows,
      { walletAddress: '', percentage: 0 },
    ]);
  });

  it('removes a recipient row', async () => {
    const onChange = vi.fn();
    render(<SplitEditor rows={rows} onChange={onChange} />);
    const user = userEvent.setup();

    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

    expect(onChange).toHaveBeenLastCalledWith([rows[1]]);
  });

  it('never offers Remove when only one row remains', () => {
    render(
      <SplitEditor
        rows={[{ walletAddress: '0xaaa', percentage: 100 }]}
        onChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('reports the running total and whether it balances', () => {
    render(<SplitEditor rows={rows} onChange={vi.fn()} />);

    expect(screen.getByText(/Total: 100\.00% \(balanced\)/)).toBeInTheDocument();
  });

  it('flags a split that does not total 100%', () => {
    render(
      <SplitEditor
        rows={[{ walletAddress: '0xaaa', percentage: 30 }]}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/must equal 100%/)).toBeInTheDocument();
  });

  it('keeps the surviving row bound to itself after a removal', async () => {
    // Regression: rows were keyed by array index. Removing row 0 left row 1
    // occupying index 0, so its inputs bound to the wrong record — editing
    // "wallet 2" edited wallet 1.
    render(<Harness initial={rows} />);
    const user = userEvent.setup();

    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

    const wallets = screen.getAllByPlaceholderText('0x...');
    expect(wallets).toHaveLength(1);
    expect(screen.getByDisplayValue('0xbbb')).toBeInTheDocument();

    await user.clear(wallets[0]);
    await user.type(wallets[0], '0xddd');

    expect(screen.getByDisplayValue('0xddd')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('0xaaa')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('0xbbb')).not.toBeInTheDocument();
  });
});
