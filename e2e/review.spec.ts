
import { test, expect } from '@playwright/test';

test.describe('Post-event review submission', () => {
  test('should allow a user to submit a review for a past event', async ({ page }) => {
    // Mock authenticated user with a ticket for a past event
    await page.route('/api/auth/session', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { id: 'clerk-user-id', email: 'test@example.com' },
          expires: new Date(Date.now() + 3600 * 1000).toISOString(),
        }),
      });
    });

    await page.route('/api/tickets/ticket-id', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: 'ticket-id',
          eventName: 'Test Event',
          eventDate: '2023-01-01T12:00:00.000Z', // Past event
          venue: 'Test Venue',
          ticketType: 'General Admission',
          ticketCode: 'TEST-123',
        }),
      });
    });

    // Navigate to the ticket page
    await page.goto('/tickets/ticket-id');

    // Assert "Leave a Review" button is visible
    const reviewButton = page.getByTestId('leave-review-button');
    await expect(reviewButton).toBeVisible();

    // Click button — assert modal opens
    await reviewButton.click();
    const reviewModal = page.getByTestId('review-modal');
    await expect(reviewModal).toBeVisible();

    // Click 4 stars — assert 4 stars are highlighted
    const starRating = reviewModal.getByTestId('star-rating-4');
    await starRating.click();
    await expect(starRating).toHaveClass(/highlighted/);

    // Type a review text
    const reviewTextArea = reviewModal.getByTestId('review-textarea');
    await reviewTextArea.fill('This was a great event! I had a lot of fun.');

    // Mock POST /api/events/:id/reviews
    await page.route('/api/events/event-id/reviews', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Click "Submit Review"
    const submitButton = reviewModal.getByTestId('submit-review-button');
    await submitButton.click();

    // Assert modal closes
    await expect(reviewModal).not.toBeVisible();

    // Assert success message appears
    const successMessage = page.getByText('You reviewed this event ★4');
    await expect(successMessage).toBeVisible();

    // Assert "Leave a Review" button is no longer visible
    await expect(reviewButton).not.toBeVisible();
  });
});