export const REVIEW = {
  MIN_RATING: 1,

  MAX_RATING: 5,

  MAX_COMMENT_LENGTH: 500,

  QUERY_KEYS: {
    REVIEWS: 'reviews',
    EVENT_REVIEWS: 'event-reviews',
    MY_REVIEW: 'my-review',
    SUMMARY: 'review-summary',
  },
} as const;