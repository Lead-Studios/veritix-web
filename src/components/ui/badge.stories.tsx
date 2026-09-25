import type { Meta, StoryObj } from '@storybook/nextjs';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Published' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => <Badge aria-label="Ticket status">● Live</Badge>,
};

export const DarkBackground: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => <Badge variant="success">Success</Badge>,
};
