import type { Meta, StoryObj } from '@storybook/react';
import { FunnelChart } from './FunnelChart';

const meta: Meta<typeof FunnelChart> = {
  title: 'Charts/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FunnelChart>;

export const Default: Story = {
  args: {
    stages: [
      { name: 'Page views', value: 12000 },
      { name: 'Add to cart', value: 4800 },
      { name: 'Checkout', value: 2200 },
      { name: 'Purchase', value: 1600 },
    ],
  },
};

export const WithCustomColors: Story = {
  args: {
    stages: [
      { name: 'Awareness', value: 50000, fill: '#4D21FF' },
      { name: 'Interest', value: 20000, fill: '#21D4FF' },
      { name: 'Decision', value: 8000, fill: '#7c3aed' },
      { name: 'Action', value: 3000, fill: '#06b6d4' },
    ],
  },
};

export const FewStages: Story = {
  args: {
    stages: [
      { name: 'Started', value: 100 },
      { name: 'Completed', value: 72 },
    ],
  },
};

export const WithCustomFormatter: Story = {
  args: {
    stages: [
      { name: 'Visitors', value: 15000 },
      { name: 'Signups', value: 4200 },
      { name: 'Subscribers', value: 890 },
    ],
    valueFormatter: (v: number) => `$${v.toLocaleString()}`,
  },
};
