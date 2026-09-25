import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Continue' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Settings">⚙</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map((variant) => (
        <Button key={variant} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="#storybook">Open the story</a>
    </Button>
  ),
};

export const DarkBackground: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => <Button variant="default">Accessible action</Button>,
};
