import type { Meta, StoryObj } from '@storybook/react';
import StatusBadge from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/Events/StatusBadge',
  component: StatusBadge,
  args: { status: 'PUBLISHED' },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Draft: Story = { args: { status: 'DRAFT' } };
export const Published: Story = { args: { status: 'PUBLISHED' } };
export const Cancelled: Story = { args: { status: 'CANCELLED' } };
export const Postponed: Story = { args: { status: 'POSTPONED' } };
export const Completed: Story = { args: { status: 'COMPLETED' } };
