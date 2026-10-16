import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'you@example.com', 'aria-label': 'Email address' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, value: 'Unavailable' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Read-only value' } };
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'not-an-email' } };
export const Types: Story = {
  render: () => (
    <div className="grid max-w-md gap-3">
      <Input type="email" placeholder="Email" aria-label="Email" />
      <Input type="password" placeholder="Password" aria-label="Password" />
      <Input type="number" placeholder="Quantity" aria-label="Quantity" />
    </div>
  ),
};
