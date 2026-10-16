import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '@/components/ui/checkbox';
import { Radio } from '@/components/ui/radio';
import { Label } from '@/components/ui/label';

describe('Checkbox', () => {
  it('renders a native checkbox so it keeps native semantics', () => {
    render(<Checkbox aria-label="Accept terms" />);

    const box = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(box.tagName).toBe('INPUT');
    expect(box).toHaveAttribute('type', 'checkbox');
  });

  it('stays in the tab order and takes a visible focus ring from the tokens', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept terms" />);

    await user.tab();

    const box = screen.getByRole('checkbox');
    expect(box).toHaveFocus();
    expect(box.className).toContain('focus-visible:ring-ring');
  });

  it('toggles on click and with Space', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept terms" />);

    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(box).toBeChecked();

    await user.keyboard(' ');
    expect(box).not.toBeChecked();
  });

  it('is operable through an associated label', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </>,
    );

    // The indicator overlay must not swallow the click the label forwards.
    await user.click(screen.getByText('Accept terms'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('reports the mixed state via aria-checked and the DOM property', () => {
    render(<Checkbox aria-label="Select all" indeterminate />);

    const box = screen.getByRole('checkbox') as HTMLInputElement;
    expect(box).toHaveAttribute('aria-checked', 'mixed');
    expect(box.indeterminate).toBe(true);
  });

  it('clears the mixed state when indeterminate goes false', () => {
    const { rerender } = render(<Checkbox aria-label="Select all" indeterminate />);
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);

    rerender(<Checkbox aria-label="Select all" indeterminate={false} />);

    const box = screen.getByRole('checkbox') as HTMLInputElement;
    expect(box.indeterminate).toBe(false);
    expect(box).not.toHaveAttribute('aria-checked');
  });

  it('honours disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept terms" disabled onChange={onChange} />);

    await user.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards a ref to the input', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox aria-label="Accept terms" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });
});

describe('Radio', () => {
  function Group() {
    return (
      <fieldset>
        <legend>Tier</legend>
        <Radio id="ga" name="tier" value="ga" defaultChecked />
        <Label htmlFor="ga">General admission</Label>
        <Radio id="vip" name="tier" value="vip" />
        <Label htmlFor="vip">VIP</Label>
      </fieldset>
    );
  }

  it('renders native radios so grouping stays native', () => {
    render(<Group />);

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0].tagName).toBe('INPUT');
    expect(radios[0]).toHaveAttribute('type', 'radio');
  });

  it('enforces single selection within a name', async () => {
    const user = userEvent.setup();
    render(<Group />);

    const [ga, vip] = screen.getAllByRole('radio');
    expect(ga).toBeChecked();

    await user.click(vip);

    expect(vip).toBeChecked();
    expect(ga).not.toBeChecked();
  });

  it('moves between options with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Group />);

    const [ga, vip] = screen.getAllByRole('radio');
    ga.focus();

    await user.keyboard('{ArrowDown}');

    expect(vip).toHaveFocus();
    expect(vip).toBeChecked();
  });

  it('is operable through an associated label', async () => {
    const user = userEvent.setup();
    render(<Group />);

    await user.click(screen.getByText('VIP'));

    expect(screen.getAllByRole('radio')[1]).toBeChecked();
  });

  it('takes a visible focus ring from the tokens', () => {
    render(<Group />);
    expect(screen.getAllByRole('radio')[0].className).toContain(
      'focus-visible:ring-ring',
    );
  });

  it('forwards a ref to the input', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio aria-label="VIP" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('radio'));
  });
});
