import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Styled native `<select>`.
 *
 * The component matches `Input`'s styling, supports a placeholder (rendered as
 * a disabled hidden option), honours `disabled` and `aria-invalid`, and keeps
 * keyboard and mobile behaviour native. Wrapping in a relative container allows
 * the chevron to sit over the native control without intercepting clicks.
 */
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  /**
   * Placeholder rendered as a disabled first option.
   *
   * The option has `hidden` so it does not appear in the dropdown once another
   * value is chosen.
   */
  placeholder?: string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    const { id, disabled, 'aria-invalid': ariaInvalid } = props;

    return (
      <span className="relative inline-flex w-full items-center">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            'flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        <ChevronDown
          aria-hidden
          className={cn(
            'pointer-events-none absolute right-3 size-4 text-muted-foreground',
            disabled && 'opacity-50',
          )}
        />
      </span>
    );
  },
);

Select.displayName = 'Select';

export { Select };
