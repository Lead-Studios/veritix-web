import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function Harness({ onSelect = vi.fn() }: { onSelect?: () => void }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Archive</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button type="button">After</button>
    </>
  );
}

const itemNames = () => screen.getAllByRole('menuitem').map((i) => i.textContent);

describe('DropdownMenu', () => {
  it('is closed initially and advertises itself on the trigger', () => {
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens on click and wires aria-controls to the menu', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    const menu = screen.getByRole('menu');
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(menu).toHaveAccessibleName('Actions');
  });

  it('opens with ArrowDown and focuses the first item', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('opens with ArrowUp on the last item when asked', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent autoFocusItem="last">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');

    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('keeps items out of the page tab order', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    for (const item of screen.getAllByRole('menuitem')) {
      expect(item).toHaveAttribute('tabindex', '-1');
    }
  });

  it('moves between items with the arrow keys, skipping disabled items', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();

    // Archive is disabled, so ArrowDown lands on Delete.
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
  });

  it('wraps around at both ends', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    // From the first item, ArrowUp wraps to the last enabled item.
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('jumps to a matching item as you type', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();

    // A second 'd' advances to the next match rather than re-matching.
    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('accumulates typed characters into one search', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    await user.keyboard('de');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('selects with Enter, calling onSelect and closing', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('selects with Space', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard(' ');

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not select a disabled item', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    const archive = screen.getByText('Archive');
    expect(archive).toHaveAttribute('aria-disabled', 'true');
    // Disabled items are not part of the roving focus set at all.
    expect(itemNames()).toContain('Archive');
    await user.keyboard('{End}');
    expect(archive).not.toHaveFocus();
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('button', { name: 'After' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('dismisses on Tab so focus can continue past the menu', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.tab();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports a controlled open state', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DropdownMenu open={false} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    // Reports intent but stays closed, because the parent owns the state.
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('throws when a part is rendered outside DropdownMenu', () => {
    expect(() => render(<DropdownMenuItem>Orphan</DropdownMenuItem>)).toThrow(
      /must be rendered inside <DropdownMenu>/,
    );
  });
});
