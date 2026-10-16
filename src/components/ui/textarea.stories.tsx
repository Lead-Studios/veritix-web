import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Textarea } from '@/components/ui/textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter a description…',
    'aria-label': 'Description',
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — empty, fully interactive. */
export const Default: Story = {};

/** Disabled — visually muted; the field is not focusable. */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'This field is disabled and cannot be edited.',
  },
};

/** Error state — red ring via `aria-invalid`, mirrors the Input component. */
export const Error: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'This value failed server-side validation.',
    'aria-describedby': 'textarea-error',
  },
  render: (args) => (
    <div className="space-y-1.5">
      <Textarea {...args} id="textarea-error-field" />
      <p id="textarea-error" className="text-sm text-destructive">
        Description must be at least 20 characters.
      </p>
    </div>
  ),
};

/**
 * Character counter — shows remaining characters beneath the field.
 * Textarea itself is unstyled; the counter is an accessible pattern that
 * any consumer can compose on top of it.
 */
export const CharacterCounter: Story = {
  args: { maxLength: 280, placeholder: "What's on your mind?" },
  render: function CharacterCounterStory(args) {
    const [value, setValue] = React.useState('');
    const max = args.maxLength ?? 280;
    const remaining = max - value.length;
    const nearLimit = remaining <= 20;
    const counterId = 'textarea-char-counter';

    return (
      <div className="space-y-1.5">
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-describedby={counterId}
        />
        <p
          id={counterId}
          className={`text-xs ${nearLimit ? 'text-destructive font-medium' : 'text-muted-foreground'}`}
          aria-live="polite"
        >
          {remaining} character{remaining !== 1 ? 's' : ''} remaining
        </p>
      </div>
    );
  },
};
