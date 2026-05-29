"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Globe, Lock, User, Copy, Check, Star, Loader2,
  LayoutGrid, List, ChevronRight, Bookmark, BookmarkCheck,
  CreditCard, ArrowLeft, Calendar, AlertCircle, Send
} from 'lucide-react';

// Inject noindex meta tag
import { useRouter } from 'next/navigation';

export default function PublicListPage() {
  const { token } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null); // { list, items }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Inject noindex on client
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  // Check session
  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(d => {
      if (d.authenticated) setSession(d.user);
    }).catch(() => {});
  }, []);

  // Load list data
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/list/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setData(d);
        } else {
          setError(d.error || 'List not found.');
        }
      })
      .catch(() => setError('Failed to load list.'))
      .finally(() => setLoading(false));
  }, [token]);

  // Load reviews
  useEffect(() => {
    if (!token) return;
    fetch(`/api/list/${token}/review`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setReviews(d.reviews);
          setAvgRating(d.averageRating);
          setReviewCount(d.count);
        }
      })
      .catch(() => {});
  }, [token, reviewSuccess]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = async () => {
    if (!session) {
      alert('Please log in to bookmark this list.');
      return;
    }
    setBookmarking(true);
    try {
      await fetch('/api/user/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId: data.list.id })
      });
      setIsBookmarked(true);
    } catch (_) {} finally {
      setBookmarking(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!session) { setReviewError('Please log in to leave a review.'); return; }
    if (!userRating) { setReviewError('Please select a star rating.'); return; }
    setSubmittingReview(true);
    setReviewError('');
    try {
      const res = await fetch(`/api/list/${token}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: userRating, comment: reviewComment })
      });
      const d = await res.json();
      if (d.success) {
        setReviewSuccess(v => !v);
        setUserRating(0);
        setReviewComment('');
      } else {
        setReviewError(d.error || 'Failed to submit review.');
      }
    } catch (_) {
      setReviewError('An error occurred. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-wider">Loading list...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <div className="glass-panel p-10 max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h1 className="text-xl font-black text-gray-900 dark:text-white mb-2">List Not Found</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { list, items } = data;

  return (
    <div className="w-full flex-grow flex flex-col gap-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            {/* Visibility Badge */}
            <div className="flex items-center gap-2">
              {list.is_private ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase rounded-md border border-gray-200 dark:border-gray-800">
                  <Lock className="w-2.5 h-2.5" /> Private
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-md border border-emerald-500/20">
                  <Globe className="w-2.5 h-2.5" /> Public
                </span>
              )}
              {avgRating && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold rounded-md border border-yellow-500/20">
                  <Star className="w-2.5 h-2.5 fill-current" /> {avgRating} ({reviewCount})
                </span>
              )}
            </div>

            <h1 className="text-3xl font-mono font-black text-gray-900 dark:text-white tracking-tight">
              {list.name}
            </h1>

            {list.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">{list.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
              <Link href={`/profile/${list.owner_name}`} className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[9px] text-white font-extrabold">
                  {list.owner_name?.charAt(0).toUpperCase()}
                </div>
                {list.owner_name}
              </Link>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(list.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" />
                {list.item_count} BINs
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={handleBookmark}
              disabled={bookmarking || isBookmarked}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold rounded-xl transition-colors ${
                isBookmarked
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle + BINs Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            BIN Entries
          </h2>
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="glass-panel p-16 text-center flex flex-col items-center gap-3">
            <CreditCard className="w-10 h-10 text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No BINs in this list yet.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((item) => (
              <Link
                key={item.bin}
                href={`/bin/${item.bin}`}
                className="glass-panel p-4 flex flex-col gap-2.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-gray-150 dark:border-gray-850 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black tracking-widest text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-0.5 rounded-lg">
                    {item.bin}
                  </span>
                  {item.flag && <span className="text-base">{item.flag}</span>}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{item.bank || '—'}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider mt-0.5 flex items-center gap-1.5 flex-wrap">
                    {item.brand && <span>{item.brand}</span>}
                    {item.type && <><span>•</span><span>{item.type}</span></>}
                    {item.level && <><span>•</span><span>{item.level}</span></>}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-850 pt-2 mt-1">
                  <span className="text-[10px] text-gray-400 font-mono">{item.country || ''}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-panel overflow-hidden border-gray-150 dark:border-gray-850">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-850 bg-gray-50 dark:bg-gray-950">
                  <th className="text-left px-4 py-3 font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">BIN</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Bank</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Brand</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Country</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={item.bin}
                    className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${idx === items.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-black text-gray-900 dark:text-white tracking-widest">
                        {item.bin}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell truncate max-w-[180px]">
                      {item.bank || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500 dark:text-gray-400 hidden md:table-cell uppercase">
                      {item.brand || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500 dark:text-gray-400 hidden lg:table-cell uppercase">
                      {item.type || '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1.5">
                        {item.flag && <span>{item.flag}</span>}
                        <span className="text-gray-500 dark:text-gray-400">{item.country || '—'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/bin/${item.bin}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Inspect <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="flex flex-col gap-6 border-t border-gray-100 dark:border-gray-850 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Reviews
            {reviewCount > 0 && (
              <span className="ml-1 text-xs font-mono text-gray-500">
                {avgRating} avg · {reviewCount} review{reviewCount !== 1 ? 's' : ''}
              </span>
            )}
          </h2>
        </div>

        {/* Submit Review */}
        <form onSubmit={handleSubmitReview} className="glass-panel p-5 flex flex-col gap-4 border-gray-150 dark:border-gray-850">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Leave a Review</p>

          {/* Star Picker */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setUserRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || userRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 dark:text-gray-700'
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            placeholder="Share your thoughts about this list... (optional)"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all resize-none"
          />

          {reviewError && (
            <div className="p-3 bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {reviewError}
            </div>
          )}

          <button
            type="submit"
            disabled={submittingReview}
            className="self-end flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="glass-panel p-4 flex flex-col gap-2 border-gray-150 dark:border-gray-850">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-extrabold">
                      {review.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{review.username}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                )}
                <span className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">
                  {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-600 font-semibold">
            No reviews yet. Be the first to review this list.
          </div>
        )}
      </div>
    </div>
  );
}
