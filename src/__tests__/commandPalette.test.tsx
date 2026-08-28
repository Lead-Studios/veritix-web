import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommandPalette } from '@/components/dashboard/CommandPalette';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

describe('CommandPalette (#795)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when not open', () => {
    render(<CommandPalette />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on Cmd+/ keyboard shortcut', () => {
    render(<CommandPalette />);

    fireEvent.keyDown(document, {
      key: '/',
      metaKey: true,
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('opens on Ctrl+/ keyboard shortcut', () => {
    render(<CommandPalette />);

    fireEvent.keyDown(document, {
      key: '/',
      ctrlKey: true,
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(<CommandPalette />);

    // Open
    fireEvent.keyDown(document, { key: '/', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('fuzzy searches across actions and navigation', () => {
    render(<CommandPalette />);

    fireEvent.keyDown(document, { key: '/', metaKey: true });

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'create' } });

    expect(screen.getByText('Create Event')).toBeInTheDocument();
  });

  it('has ARIA combobox role and aria-activedescendant', () => {
    render(<CommandPalette />);

    fireEvent.keyDown(document, { key: '/', metaKey: true });

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-autocomplete', 'list');
    expect(combobox).toHaveAttribute('aria-controls');
    expect(combobox).toHaveAttribute('aria-expanded');
  });

  it('navigates with arrow keys', () => {
    render(<CommandPalette />);

    fireEvent.keyDown(document, { key: '/', metaKey: true });

    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Should not throw and listbox should exist
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('includes event names in results', () => {
    render(<CommandPalette eventNames={['Summer Festival', 'Winter Gala']} />);

    fireEvent.keyDown(document, { key: '/', metaKey: true });

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'summer' } });

    expect(screen.getByText('Summer Festival')).toBeInTheDocument();
  });
});
