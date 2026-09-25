import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function MenuExample({ align = 'start' as 'start' | 'end', disabled = false }: { align?: 'start' | 'end'; disabled?: boolean }) {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Open actions</DropdownMenuTrigger>
      <DropdownMenuContent align={align} aria-label="Event actions">
        <DropdownMenuItem>Edit event</DropdownMenuItem>
        <DropdownMenuItem>Duplicate event</DropdownMenuItem>
        <DropdownMenuItem disabled={disabled}>Archive event</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete event</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const DefaultOpen: Story = { render: () => <MenuExample /> };
export const AlignEnd: Story = { render: () => <MenuExample align="end" /> };
export const WithDisabledItem: Story = { render: () => <MenuExample disabled /> };
export const AutofocusLast: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Open actions</DropdownMenuTrigger>
      <DropdownMenuContent autoFocusItem="last" aria-label="Actions focused on the last item">
        <DropdownMenuItem>First action</DropdownMenuItem>
        <DropdownMenuItem>Last action</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
