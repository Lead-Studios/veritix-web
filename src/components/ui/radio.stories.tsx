import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Radio } from '@/components/ui/radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: { name: 'ticket-type', value: 'standard' },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

function RadioGroup({ disabled = false, invalid = false }: { disabled?: boolean; invalid?: boolean }) {
  const [value, setValue] = React.useState('standard');
  return (
    <fieldset className="grid w-64 gap-3">
      <legend className="mb-1 text-sm font-medium">Ticket type</legend>
      {['standard', 'vip'].map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm capitalize">
          <Radio
            name="ticket-type"
            value={option}
            checked={value === option}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            onChange={() => setValue(option)}
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}

export const Unselected: Story = { render: () => <RadioGroup /> };
export const Selected: Story = { render: () => <RadioGroup /> };
export const Disabled: Story = { render: () => <RadioGroup disabled /> };
export const Invalid: Story = { render: () => <RadioGroup invalid /> };
