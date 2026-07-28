export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;

  rating: ReviewRating;

  comment?: string;

  createdAt: string;

  updatedAt: string;
}

export interface CreateReviewDto {
  eventId: string;
  rating: ReviewRating;
  comment?: string;
}

export interface UpdateReviewDto {
  rating: ReviewRating;
  comment?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;

  distribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
}