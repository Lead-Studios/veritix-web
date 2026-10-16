import type { Meta, StoryObj } from '@storybook/nextjs';
import { Spinner } from '@/components/ui/spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Loading' } };
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-5 text-muted-foreground">
      <Spinner className="size-3" label="Small" />
      <Spinner className="size-6" label="Medium" />
      <Spinner className="size-10" label="Large" />
    </div>
  ),
};
export const Decorative: Story = {
  args: { label: null },
  render: () => <Spinner label={null} />,
};
