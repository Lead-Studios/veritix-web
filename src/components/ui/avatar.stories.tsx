import type { Meta, StoryObj } from '@storybook/nextjs';
import { Avatar } from '@/components/ui/avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { alt: 'Nafiu Ishaq' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FallbackInitials: Story = {};

export const CustomFallback: Story = {
  args: { fallback: 'VT' },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&q=80',
  },
};

export const ImageFailed: Story = {
  args: { src: '/images/does-not-exist.png', fallback: 'NI' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-6 text-[9px]" alt="Small avatar" />
      <Avatar alt="Default avatar" />
      <Avatar className="size-16 text-base" alt="Large avatar" />
    </div>
  ),
};
