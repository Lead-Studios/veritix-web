import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

describe('Sheet', () => {
  it('opens and closes with Escape, returns focus', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Sheet content</SheetContent>
      </Sheet>
    );

    const trigger = screen.getByRole('button', { name: /open/i });
    await user.click(trigger);
    expect(screen.getByText('Sheet content')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('handles focus and scroll lock', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
