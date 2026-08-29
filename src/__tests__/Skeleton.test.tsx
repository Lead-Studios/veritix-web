import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from '../components/ui/Skeleton';
import { describe, it, expect } from 'vitest';

describe('Skeleton Component', () => {
  it('renders correct number of skeleton loaders', () => {
    const { container } = render(<Skeleton className="w-10 h-10" />);
    expect(container.firstChild).toBeDefined();
  });
});
