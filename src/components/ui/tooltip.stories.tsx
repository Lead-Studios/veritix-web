import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Copy ticket reference',
    children: <Button aria-label="Copy ticket reference">Copy</Button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Top: Story = { args: { side: 'top' } };
export const Right: Story = { args: { side: 'right' } };
export const Bottom: Story = { args: { side: 'bottom' } };
export const Left: Story = { args: { side: 'left' } };
export const Delayed: Story = { args: { delayMs: 500 } };
export const DisabledTrigger: Story = {
  args: { children: <Button disabled aria-label="Copy ticket reference">Copy</Button> },
};
