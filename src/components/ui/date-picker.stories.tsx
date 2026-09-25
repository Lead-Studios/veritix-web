import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { DatePicker } from '@/components/ui/date-picker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    label: 'Event date',
    value: '2026-09-25',
    onChange: () => undefined,
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function DatePickerExample({ initial = '', ...props }: { initial?: string; min?: string; max?: string; disabled?: boolean }) {
  const [value, setValue] = React.useState(initial);
  return <DatePicker {...props} value={value} onChange={setValue} />;
}

export const Empty: Story = { render: () => <DatePickerExample label="Event date" /> };
export const WithValue: Story = { render: () => <DatePickerExample initial="2026-09-25" label="Event date" /> };
export const Constrained: Story = {
  render: () => <DatePickerExample initial="2026-09-25" label="Event date" min="2026-09-20" max="2026-09-30" />,
};
export const Disabled: Story = { render: () => <DatePickerExample initial="2026-09-25" label="Event date" disabled /> };
export const InvalidEntry: Story = {
  render: () => <DatePickerExample initial="not-a-date" label="Event date" />,
};
