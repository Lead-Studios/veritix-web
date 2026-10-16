import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimplePanel: Story = {
  render: () => (
    <Sheet title="Filters" description="Narrow the listing by date or city." triggerLabel="Open filters">
      <p className="text-sm">Filter controls live here.</p>
    </Sheet>
  ),
};

export const CompoundOpen: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetHeader>
        <SheetTitle>Navigation</SheetTitle>
        <SheetDescription>Move between your VeriTix workspace.</SheetDescription>
      </SheetHeader>
      <SheetContent side="right" title="Navigation">
        <p>Dashboard</p>
        <p>Events</p>
        <p>My tickets</p>
        <SheetFooter><Button>Close panel</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftPanel: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent side="left" title="Main navigation">
        <p>Dashboard</p>
        <p>Events</p>
      </SheetContent>
    </Sheet>
  ),
};

export const TriggerWithAsChild: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button>Open navigation</Button></SheetTrigger>
      <SheetContent title="Navigation">Choose a destination.</SheetContent>
    </Sheet>
  ),
};
