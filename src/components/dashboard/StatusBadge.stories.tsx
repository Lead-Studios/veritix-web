import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Dashboard/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Active: Story = {
  args: {
    text: 'Live now',
    status: 'active',
  },
};

export const Draft: Story = {
  args: {
    text: 'Coming soon',
    status: 'draft',
  },
};

export const Ended: Story = {
  args: {
    text: 'Event ended',
    status: 'ended',
  },
};

export const Cancelled: Story = {
  args: {
    text: 'Cancelled',
    status: 'cancelled',
  },
};
