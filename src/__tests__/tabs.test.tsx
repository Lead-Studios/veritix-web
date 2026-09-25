import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Harness({
  orientation = 'horizontal' as const,
  onValueChange,
}: {
  orientation?: 'horizontal' | 'vertical';
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs defaultValue="overview" orientation={orientation} onValueChange={onValueChange}>
      <TabsList aria-label="Event sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="archived" disabled>
          Archived
        </TabsTrigger>
        <TabsTrigger value="attendees">Attendees</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Overview panel <a href="#o">overview link</a>
      </TabsContent>
      <TabsContent value="tickets">Tickets panel</TabsContent>
      <TabsContent value="archived">Archived panel</TabsContent>
      <TabsContent value="attendees">Attendees panel</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a labelled tablist with tabs', () => {
    render(<Harness />);

    expect(screen.getByRole('tablist')).toHaveAccessibleName('Event sections');
    expect(screen.getAllByRole('tab')).toHaveLength(4);
  });

  it('marks the default tab selected and wires aria-controls to its panel', () => {
    render(<Harness />);

    const tab = screen.getByRole('tab', { name: 'Overview' });
    const panel = screen.getByRole('tabpanel');

    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAccessibleName('Overview');
  });

  it('renders only the selected panel, keeping the rest out of the tree', () => {
    render(<Harness />);

    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByText(/Overview panel/)).toBeInTheDocument();
    expect(screen.queryByText('Tickets panel')).not.toBeInTheDocument();
  });

  it('keeps one tab stop for the whole tablist', () => {
    render(<Harness />);

    const [overview, tickets] = screen.getAllByRole('tab');
    expect(overview).toHaveAttribute('tabindex', '0');
    expect(tickets).toHaveAttribute('tabindex', '-1');
  });

  it('puts the tablist then the panel in the tab order, not every tab', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

    // Next stop is the panel's own content, not the Tickets tab.
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Tickets' })).not.toHaveFocus();
  });

  it('moves and selects with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowRight}');

    const tickets = screen.getByRole('tab', { name: 'Tickets' });
    expect(tickets).toHaveFocus();
    expect(tickets).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Tickets panel')).toBeInTheDocument();
  });

  it('skips disabled tabs', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    screen.getByRole('tab', { name: 'Tickets' }).focus();
    await user.keyboard('{ArrowRight}');

    // Archived is disabled, so focus lands on Attendees.
    expect(screen.getByRole('tab', { name: 'Attendees' })).toHaveFocus();
  });

  it('wraps at both ends', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Attendees' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Attendees' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('uses up and down when vertical', async () => {
    const user = userEvent.setup();
    render(<Harness orientation="vertical" />);

    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Tickets' })).toHaveFocus();

    // Horizontal keys do nothing in a vertical tablist.
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tickets' })).toHaveFocus();
  });

  it('selects on click', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('tab', { name: 'Attendees' }));

    expect(screen.getByText('Attendees panel')).toBeInTheDocument();
  });

  it('does not select a disabled tab', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const archived = screen.getByRole('tab', { name: 'Archived' });
    expect(archived).toHaveAttribute('aria-disabled', 'true');

    await user.click(archived);

    expect(screen.queryByText('Archived panel')).not.toBeInTheDocument();
  });

  it('reports changes to onValueChange', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('tab', { name: 'Tickets' }));

    expect(onValueChange).toHaveBeenCalledWith('tickets');
  });

  it('supports a controlled value', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Tabs value="overview" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="tickets">Tickets panel</TabsContent>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Tickets' }));

    // Reports intent but does not move, because the parent owns the value.
    expect(onValueChange).toHaveBeenCalledWith('tickets');
    expect(screen.getByText('Overview panel')).toBeInTheDocument();
  });

  it('exposes the panel itself as a focus target', () => {
    render(<Harness />);
    expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
  });

  it('throws when a part is rendered outside Tabs', () => {
    expect(() => render(<TabsTrigger value="x">Orphan</TabsTrigger>)).toThrow(
      /must be rendered inside <Tabs>/,
    );
  });
});
