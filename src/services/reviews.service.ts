import {
  CreateReviewDto,
  Review,
  ReviewSummary,
} from '@/types/review';

import { api } from '@/lib/api';

export const ReviewsService = {
  async create(
    payload: CreateReviewDto,
  ): Promise<Review> {
    const { data } = await api.post(
      '/reviews',
      payload,
    );

    return data;
  },

  async getEventReviews(
    eventId: string,
  ): Promise<Review[]> {
    const { data } = await api.get(
      `/events/${eventId}/reviews`,
    );

    return data;
  },

  async getMyReview(
    eventId: string,
  ): Promise<Review | null> {
    const { data } = await api.get(
      `/events/${eventId}/reviews/me`,
    );

    return data;
  },

  async getSummary(
    eventId: string,
  ): Promise<ReviewSummary> {
    const { data } = await api.get(
      `/events/${eventId}/reviews/summary`,
    );

    return data;
  },
};