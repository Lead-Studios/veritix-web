import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Switch } from '@/components/ui/switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { 'aria-label': 'Email notifications', checked: false, onCheckedChange: () => undefined },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function SwitchExample({ initial = false, disabled = false }: { initial?: boolean; disabled?: boolean }) {
  const [checked, setChecked] = React.useState(initial);
  return (
    <label className="flex items-center gap-3 text-sm">
      <Switch checked={checked} onCheckedChange={setChecked} disabled={disabled} aria-label="Email notifications" />
      <span>Email notifications</span>
    </label>
  );
}

export const Off: Story = { render: () => <SwitchExample /> };
export const On: Story = { render: () => <SwitchExample initial /> };
export const Disabled: Story = { render: () => <SwitchExample disabled /> };
export const DisabledOn: Story = { render: () => <SwitchExample initial disabled /> };
