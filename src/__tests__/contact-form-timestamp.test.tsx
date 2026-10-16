import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContactForm } from '@/components/contact-form';

function renderedAtField(container: HTMLElement): HTMLInputElement {
  const field = container.querySelector<HTMLInputElement>('input[name="renderedAt"]');
  if (!field) throw new Error('renderedAt field not found');
  return field;
}

describe('ContactForm render timestamp', () => {
  it('records when the form was rendered', () => {
    const before = Date.now();
    const { container } = render(<ContactForm />);
    const after = Date.now();

    const value = Number(renderedAtField(container).value);

    expect(Number.isFinite(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(before);
    expect(value).toBeLessThanOrEqual(after);
  });

  it('keeps the same timestamp across re-renders', () => {
    const { container, rerender } = render(<ContactForm />);
    const first = renderedAtField(container).value;

    rerender(<ContactForm className="other" />);

    expect(renderedAtField(container).value).toBe(first);
  });
});
