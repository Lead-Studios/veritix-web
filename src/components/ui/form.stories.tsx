import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

type DemoValues = { email: string };

function FormExample({ invalid = false, disabled = false }: { invalid?: boolean; disabled?: boolean }) {
  const form = useForm<DemoValues>({ defaultValues: { email: invalid ? '' : 'person@example.com' } });
  const [showError] = React.useState(invalid);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="grid w-80 gap-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email address</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" disabled={disabled} {...field} />
              </FormControl>
              <FormDescription>We will only use this to send important updates.</FormDescription>
              {showError ? <FormMessage>Enter a valid email address.</FormMessage> : null}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled}>Save preferences</Button>
      </form>
    </Form>
  );
}

export const Valid: Story = { render: () => <FormExample /> };
export const Error: Story = { render: () => <FormExample invalid /> };
export const Disabled: Story = { render: () => <FormExample disabled /> };
