import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Shared/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const DefaultError: Story = {
  args: {
    message: 'Unable to load your analytics data. Please try again.',
    action: { label: 'Retry', onClick: () => {} },
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Your session will expire in 5 minutes.',
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    message: 'Maintenance scheduled for Saturday at 2 AM UTC.',
  },
};

export const NotFound: Story = {
  args: {
    type: 'notFound',
    message: "The event you're looking for doesn't exist or has been removed.",
    action: { label: 'Browse events', onClick: () => {} },
  },
};

export const Unauthorized: Story = {
  args: {
    type: 'unauthorized',
    message: "You don't have permission to view this page.",
    action: { label: 'Sign in', onClick: () => {} },
    secondaryAction: { label: 'Go home', onClick: () => {} },
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Payment failed',
    message: 'Your card was declined. Please check your details and try again.',
    action: { label: 'Update payment method', onClick: () => {} },
  },
};
