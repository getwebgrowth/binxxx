"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, ChevronLeft, ChevronRight, Plus, X, Loader2, AlertCircle, Send } from "lucide-react";
import Link from "next/link";

export default function CommunityReviews({ binNumber }) {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [session, setSession] = useState(null);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Check session
  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(d => {
      if (d.authenticated) setSession(d.user);
    }).catch(() => {});
  }, []);

  // Fetch reviews for this BIN
  const fetchReviews = useCallback(async (page = 1) => {
    if (!binNumber) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bin-reviews?bin=${binNumber}&page=${page}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setTotal(data.total);
        setTotalPages(data.totalPages || 1);
        setAvg(data.avg);
      }
    } catch (_) {}
    finally { setLoading(false); }
  }, [binNumber]);

  useEffect(() => { fetchReviews(currentPage); }, [fetchReviews, currentPage, submitSuccess]);

  const handlePageChange = (dir) => {
    if (dir === "next" && currentPage < totalPages) setCurrentPage(p => p + 1);
    if (dir === "prev" && currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) { setSubmitError('Please log in to leave a review.'); return; }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/bin-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bin: binNumber, rating, comment: reviewText }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setReviewText('');
        setRating(5);
        setSubmitSuccess(v => !v); // trigger re-fetch
        setCurrentPage(1);
      } else {
        setSubmitError(data.error || 'Failed to submit review.');
      }
    } catch (_) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const StarPicker = ({ value, onHover, onSelect }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          onMouseEnter={() => onHover(s)}
          onMouseLeave={() => onHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`w-5 h-5 transition-colors ${s <= (hoverRating || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="glass-panel p-5 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-500" />
            Reviews
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Community notes for BIN {binNumber}.</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setSubmitError(''); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-950 text-white text-xs font-bold rounded-lg shadow transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Review
        </button>
      </div>

      {/* Aggregate + Pagination */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900 dark:text-white">{avg ?? '—'}</span>
            <span className="text-xs text-gray-400 font-bold">/ 5</span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Based on {total} review{total !== 1 ? 's' : ''}</span>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2.5">
            <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg border border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center text-gray-500 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-gray-500">{currentPage} / {totalPages}</span>
            <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center text-gray-500 disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-blue-500" /></div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
          {reviews.map((review) => (
            <div key={review.id}
              className="p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-200/40 dark:border-gray-850 hover:border-gray-300 dark:hover:border-gray-800 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-450 font-bold text-xs uppercase flex items-center justify-center border border-blue-200/40 dark:border-blue-800/40">
                    {review.username?.substring(0, 2) || '??'}
                  </div>
                  <div>
                    <Link href={`/profile/${review.username}`}
                      className="text-xs font-bold text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      {review.username}
                    </Link>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
                      ))}
                      <span className="text-[10px] text-gray-400 font-medium">{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-mono font-medium shrink-0">{timeAgo(review.created_at)}</span>
              </div>
              {review.comment && (
                <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-line pl-0.5">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 flex flex-col items-center gap-2">
          <MessageSquare className="w-10 h-10 text-gray-200 dark:text-gray-800" />
          <p className="text-xs font-bold text-gray-400 dark:text-gray-600">No reviews yet. Be the first!</p>
        </div>
      )}

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 relative overflow-hidden animate-scale-up">
            <button onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-650 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Add Review for BIN <span className="font-mono">{binNumber}</span>
            </h3>
            {!session && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-900">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                You must be logged in to leave a review.
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Share your experience with this BIN prefix.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Rating</label>
                <StarPicker value={rating} onHover={setHoverRating} onSelect={setRating} />
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-1 block">{rating} out of 5</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Review / Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  placeholder="Type your notes here..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-250 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-900">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {submitError}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-650 dark:text-gray-300 text-xs font-bold rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || !session}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-950 text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50">
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
