import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogExample({ destructive = false }: { destructive?: boolean }) {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{destructive ? 'Delete event?' : 'Ticket details'}</DialogTitle>
            <DialogDescription>
              {destructive ? 'This action cannot be undone.' : 'Review the information before continuing.'}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Dialogs trap focus, close with Escape, and return focus to the trigger.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant={destructive ? 'destructive' : 'default'} onClick={() => setOpen(false)}>
              {destructive ? 'Delete' : 'Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const DefaultOpen: Story = { render: () => <DialogExample /> };
export const Destructive: Story = { render: () => <DialogExample destructive /> };
export const LongContent: Story = {
  render: () => <DialogExample />,
};
