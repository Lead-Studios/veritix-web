/**
 * Component tests for EventDetailClient (FE-TASK-1).
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EventDetailClient from '@/app/(public)/events/[eventId]/EventDetailClient';

// Mocks
vi.mock('next/navigation', () => ({
  useParams: () => ({ eventId: 'evt-1' }),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('@/hooks/useEvents', () => ({
  useEvent: () => ({
    event: {
      id: 'evt-1',
      name: 'Test Event',
      description:
        '<p>This is a test description.</p><a href="https://example.com">Click here</a><script>alert("XSS")</script>',
      date: '2025-01-01',
      time: '12:00 PM',
      venue: 'Test Venue',
      image: '/test-event.png',
      ticketOptions: [],
    },
    loading: false,
  }),
}));

vi.mock('@/hooks/useFavorite', () => ({
  useFavorite: () => ({
    isLiked: false,
    isPending: false,
    error: null,
    toggle: vi.fn(),
  }),
}));

describe('EventDetailClient', () => {
  it('sanitizes the event description and adds correct attributes to links', () => {
    render(<EventDetailClient />);

    // Check that the script tag is not rendered
    expect(screen.queryByText('alert("XSS")')).toBeNull();

    // Check that the link is rendered with the correct attributes
    const link = screen.getByText('Click here');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
