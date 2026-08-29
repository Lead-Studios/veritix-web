import type { Meta, StoryObj } from '@storybook/react';
import { LoadingState } from './LoadingState';

const meta: Meta<typeof LoadingState> = {
  title: 'Shared/LoadingState',
  component: LoadingState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Spinner: Story = {
  args: {
    variant: 'spinner',
    text: 'Loading…',
  },
};

export const Skeleton: Story = {
  args: {
    variant: 'skeleton',
  },
};

export const Card: Story = {
  args: {
    variant: 'card',
    count: 3,
  },
};

export const List: Story = {
  args: {
    variant: 'list',
    count: 4,
  },
};

export const CustomText: Story = {
  args: {
    variant: 'spinner',
    text: 'Fetching your tickets…',
  },
};
