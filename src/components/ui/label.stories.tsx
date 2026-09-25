import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Email address' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-64 gap-2">
      <Label htmlFor="label-email">Email address</Label>
      <Input id="label-email" type="email" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="grid w-64 gap-2">
      <Label htmlFor="label-required" required>Email address</Label>
      <Input id="label-required" type="email" required />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-64 gap-2">
      <Label htmlFor="label-disabled" className="opacity-50">Email address</Label>
      <Input id="label-disabled" type="email" disabled />
    </div>
  ),
};
