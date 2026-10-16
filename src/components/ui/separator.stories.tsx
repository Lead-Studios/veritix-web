import type { Meta, StoryObj } from '@storybook/nextjs';
import { Separator } from '@/components/ui/separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { render: () => <Separator className="my-6" /> };
export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4">
      <span>Before</span>
      <Separator orientation="vertical" className="h-8" />
      <span>After</span>
    </div>
  ),
};
export const Labelled: Story = {
  args: { decorative: false, 'aria-label': 'Account sections' },
  render: () => <Separator className="my-6" decorative={false} />,
};
