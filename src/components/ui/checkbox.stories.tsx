import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Checkbox } from '@/components/ui/checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { 'aria-label': 'Email notifications' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function CheckboxExample({ indeterminate = false, disabled = false }: { indeterminate?: boolean; disabled?: boolean }) {
  const [checked, setChecked] = React.useState(false);
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox
        checked={indeterminate ? false : checked}
        indeterminate={indeterminate}
        disabled={disabled}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <span>Email me about ticket updates</span>
    </label>
  );
}

export const Unchecked: Story = { render: () => <CheckboxExample /> };
export const Checked: Story = { args: { checked: true }, render: () => <CheckboxExample /> };
export const Indeterminate: Story = { render: () => <CheckboxExample indeterminate /> };
export const Disabled: Story = { render: () => <CheckboxExample disabled /> };
export const Invalid: Story = {
  args: { 'aria-invalid': true },
  render: () => (
    <label className="flex items-center gap-2 text-sm text-destructive">
      <Checkbox aria-label="Required consent" aria-invalid />
      I accept the terms
    </label>
  ),
};
