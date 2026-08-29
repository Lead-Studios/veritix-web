'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';

interface PostEventReviewModalProps {
  eventId: string;
  eventName: string;
  onClose: () => void;
  onSuccess: (rating: number) => void;
}

const MIN_REVIEW_LENGTH = 20;
const MAX_REVIEW_LENGTH = 500;

export function PostEventReviewModal({
  eventId,
  eventName,
  onClose,
  onSuccess,
}: PostEventReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewLength = review.trim().length;
  const isValid =
    rating >= 1 && reviewLength >= MIN_REVIEW_LENGTH && reviewLength <= MAX_REVIEW_LENGTH;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/events/${eventId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review: review.trim(), anonymous }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { message?: string }).message ?? `Server error ${res.status}`,
        );
      }

      // Persist reviewed state so the badge survives a page refresh
      try {
        localStorage.setItem(`reviewed_event_${eventId}`, String(rating));
      } catch {
        // localStorage may be unavailable in some environments
      }

      onSuccess(rating);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Submission failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#0d1530] border border-[#4D21FF]/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#4D21FF]">
          <h2 id="review-modal-title" className="text-lg font-bold text-white">
            Review: {eventName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Close review modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <fieldset>
            <legend className="text-sm font-semibold text-white mb-3">
              Your rating <span className="text-red-400">*</span>
            </legend>
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setRating(star);
                  }}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  aria-pressed={rating === star}
                  className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] rounded"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= displayRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/30'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-amber-400 font-semibold">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>
          </fieldset>

          {/* Review Text */}
          <div>
            <label
              htmlFor="review-text"
              className="block text-sm font-semibold text-white mb-2"
            >
              Your review <span className="text-red-400">*</span>
            </label>
            <textarea
              id="review-text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={MAX_REVIEW_LENGTH}
              rows={4}
              placeholder="Share your experience at this event (min 20 characters)…"
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm px-4 py-3 focus:outline-none focus:border-[#4D21FF] transition-colors resize-none"
            />
            <div className="flex justify-between mt-1 text-xs">
              <span
                className={
                  reviewLength > 0 && reviewLength < MIN_REVIEW_LENGTH
                    ? 'text-red-400'
                    : 'text-gray-500'
                }
              >
                {reviewLength < MIN_REVIEW_LENGTH
                  ? `${MIN_REVIEW_LENGTH - reviewLength} more characters needed`
                  : 'Minimum length met ✓'}
              </span>
              <span
                className={
                  reviewLength > MAX_REVIEW_LENGTH * 0.9
                    ? 'text-amber-400'
                    : 'text-gray-500'
                }
              >
                {reviewLength}/{MAX_REVIEW_LENGTH}
              </span>
            </div>
          </div>

          {/* Anonymous Toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  anonymous ? 'bg-[#4D21FF]' : 'bg-white/20'
                }`}
              />
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  anonymous ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </div>
            <span className="text-sm text-gray-300">Post anonymously</span>
          </label>

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="text-sm text-red-400 bg-red-950/30 border border-red-500/30 rounded-lg px-4 py-2"
            >
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
