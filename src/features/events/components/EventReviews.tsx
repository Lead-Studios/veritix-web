'use client';

import { useEffect, useState, useCallback } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  review: string;
  authorName: string;
  createdAt: string;
}

interface ReviewsPage {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

interface EventReviewsProps {
  eventId: string;
}

const PAGE_LIMIT = 5;

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${
            star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-white/20'
          }`}
        />
      ))}
    </div>
  );
}

function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right text-gray-400">{star}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-gray-500">{count}</span>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/**
 * Displays the average star rating and a paginated list of attendee reviews
 * for an event. Fetches from GET /api/events/:id/reviews.
 *
 * @see Issue #673
 */
export function EventReviews({ eventId }: EventReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(
    async (pageNum: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/events/${eventId}/reviews?page=${pageNum}&limit=${PAGE_LIMIT}`,
        );
        if (!res.ok) throw new Error(`Failed to load reviews (${res.status})`);
        const data = (await res.json()) as ReviewsPage;
        setTotal(data.total);
        setReviews((prev) => (append ? [...prev, ...data.reviews] : data.reviews));
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load reviews.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [eventId],
  );

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Distribution count per star level
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const hasMore = reviews.length < total;

  return (
    <section className="space-y-6" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-2xl font-bold text-white">
        Reviews
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-6 text-center text-sm text-red-300">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center text-gray-400">
          <Star className="w-10 h-10 mx-auto mb-3 text-white/20" />
          <p className="font-semibold text-white">No reviews yet</p>
          <p className="text-sm mt-1">
            Be the first to review after attending this event.
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="flex flex-col sm:flex-row gap-6 rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
              <span className="text-5xl font-bold text-white">
                {avgRating.toFixed(1)}
              </span>
              <StarRating rating={avgRating} size="lg" />
              <span className="text-xs text-gray-500">
                {total} review{total !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex-1 space-y-2">
              {distribution.map(({ star, count }) => (
                <RatingBar key={star} star={star} count={count} total={reviews.length} />
              ))}
            </div>
          </div>

          {/* Individual reviews */}
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{r.authorName}</p>
                    <StarRating rating={r.rating} />
                  </div>
                  <time dateTime={r.createdAt} className="text-xs text-gray-500 shrink-0">
                    {timeAgo(r.createdAt)}
                  </time>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{r.review}</p>
              </li>
            ))}
          </ul>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fetchReviews(page + 1, true)}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-[#4D21FF]/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4D21FF]/20 transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading…
                  </>
                ) : (
                  `Load more (${total - reviews.length} remaining)`
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
