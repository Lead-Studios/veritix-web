import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Event ticket</CardTitle>
        <CardDescription>Manage the details guests will see.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Your event is ready to publish.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Edit</Button>
        <Button size="sm" variant="outline">Preview</Button>
      </CardFooter>
    </Card>
  ),
};

export const Minimal: Story = {
  render: () => <Card className="w-full max-w-sm p-6">A compact card surface.</Card>,
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-full max-w-sm p-6">
      <CardTitle>Organizer profile</CardTitle>
      <p className="mt-2 text-sm text-muted-foreground">Keep your public details current.</p>
      <Button className="mt-4" size="sm">Update profile</Button>
    </Card>
  ),
};
