import { z } from 'zod';

import { REVIEW } from '@/constants/review.constants';

export const reviewSchema = z.object({
  eventId: z.string().uuid(),

  rating: z
    .number()
    .min(REVIEW.MIN_RATING)
    .max(REVIEW.MAX_RATING),

  comment: z
    .string()
    .max(REVIEW.MAX_COMMENT_LENGTH)
    .optional(),
});

export type ReviewFormValues = z.infer<
  typeof reviewSchema
>;