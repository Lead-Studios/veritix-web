import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { defaultValue: 'overview' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const TabsExample = ({ vertical = false }: { vertical?: boolean }) => (
  <Tabs defaultValue="overview" orientation={vertical ? 'vertical' : 'horizontal'} className="max-w-lg">
    <TabsList aria-label="Event details">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="tickets">Tickets</TabsTrigger>
      <TabsTrigger value="venue">Venue</TabsTrigger>
      <TabsTrigger value="sold-out" disabled>Sold out</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">A quick overview of the event.</TabsContent>
    <TabsContent value="tickets">Choose ticket tiers and quantities.</TabsContent>
    <TabsContent value="venue">See where the event takes place.</TabsContent>
    <TabsContent value="sold-out">This tab cannot be selected.</TabsContent>
  </Tabs>
);

export const Default: Story = { render: () => <TabsExample /> };
export const Vertical: Story = { render: () => <TabsExample vertical /> };
export const DisabledTab: Story = { render: () => <TabsExample /> };
