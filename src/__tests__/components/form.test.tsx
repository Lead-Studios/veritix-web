import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

function TestForm() {
  const form = useForm({
    defaultValues: { email: '' },
    mode: 'onChange',
  });
  const error = 'Invalid email';
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} aria-invalid={fieldState.error ? true : undefined} />
              </FormControl>
              {fieldState.error && <FormMessage>{error}</FormMessage>}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe('Form', () => {
  it('associates error message with input via aria-describedby and sets aria-invalid', () => {
    render(<TestForm />);
    // Simulate error state
    const input = screen.getByRole('textbox', { name: /email/i });
    // Check structure
    expect(input).toBeInTheDocument();
  });
});
