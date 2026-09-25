import type { Meta, StoryObj } from '@storybook/nextjs';
import { Pagination } from '@/components/ui/pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, totalPages: 5, hrefForPage: (page: number) => `#page-${page}` },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = { args: { page: 1 } };
export const MiddlePage: Story = { args: { page: 3 } };
export const LastPage: Story = { args: { page: 5 } };
export const SinglePage: Story = { args: { page: 1, totalPages: 1 } };
