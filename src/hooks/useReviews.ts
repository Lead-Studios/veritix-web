import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { REVIEW } from '@/constants/review.constants';

import { ReviewsService } from '@/services/reviews.service';

export function useEventReviews(eventId: string) {
  return useQuery({
    queryKey: [REVIEW.QUERY_KEYS.EVENT_REVIEWS, eventId],

    queryFn: () => ReviewsService.getEventReviews(eventId),
  });
}

export function useReviewSummary(eventId: string) {
  return useQuery({
    queryKey: [REVIEW.QUERY_KEYS.SUMMARY, eventId],

    queryFn: () => ReviewsService.getSummary(eventId),
  });
}

export function useMyReview(eventId: string) {
  return useQuery({
    queryKey: [REVIEW.QUERY_KEYS.MY_REVIEW, eventId],

    queryFn: () => ReviewsService.getMyReview(eventId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ReviewsService.create,

    onSuccess(review) {
      queryClient.invalidateQueries({
        queryKey: [REVIEW.QUERY_KEYS.EVENT_REVIEWS, review.eventId],
      });

      queryClient.invalidateQueries({
        queryKey: [REVIEW.QUERY_KEYS.SUMMARY, review.eventId],
      });

      queryClient.invalidateQueries({
        queryKey: [REVIEW.QUERY_KEYS.MY_REVIEW, review.eventId],
      });
    },
  });
}
