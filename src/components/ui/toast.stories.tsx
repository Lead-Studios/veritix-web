import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/components/ui/button';
import { ToastProvider, useToast } from '@/components/ui/toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastExample({ count = 1 }: { count?: number }) {
  const { toast, dismissAll } = useToast();
  React.useEffect(() => {
    for (let index = 0; index < count; index += 1) {
      const variants = ['default', 'success', 'error'] as const;
      toast({
        title: ['Saved', 'Ticket issued', 'Payment failed'][index % 3],
        description: 'A message is announced without interrupting the page.',
        variant: variants[index % variants.length],
        duration: null,
      });
    }
  }, [count, toast]);
  return <Button onClick={dismissAll}>Dismiss all</Button>;
}

function ToastGallery({ count = 1 }: { count?: number }) {
  return <ToastProvider><ToastExample count={count} /></ToastProvider>;
}

export const Default: Story = { render: () => <ToastGallery /> };
export const AllVariants: Story = { render: () => <ToastGallery count={3} /> };
export const LimitExceeded: Story = { render: () => <ToastGallery count={4} /> };
export const ManualDismiss: Story = { render: () => <ToastGallery /> };
