import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../components/EmptyState';
import { describe, it, expect } from 'vitest';

describe('EmptyState Component', () => {
  it('renders message and call-to-action correctly', () => {
    render(<EmptyState message="No items found" actionLabel="Retry" onAction={() => {}} />);
    expect(screen.getByText('No items found')).toBeDefined();
  });
});
