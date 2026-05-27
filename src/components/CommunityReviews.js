"use client";

import { useState } from "react";
import { Star, MessageSquare, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

const INITIAL_REVIEWS = [
  {
    user: "touche",
    rating: 5,
    time: "4 days ago",
    text: "holy fuck hitting crypto with this 😂",
    tags: []
  },
  {
    user: "nitro",
    rating: 5,
    time: "11 days ago",
    text: "One of the Classics. Top 3 bin. Chase is pretty iffy sometimes when it comes to their bins, but 414720 has stood the test of time and continues to give when it really shouldn't. Monster bin. Can run anything.",
    tags: []
  },
  {
    user: "givemeurmoney",
    rating: 4,
    time: "11 days ago",
    text: "Still hitting Hit lavish luck casino for $400 card is dead now after one transaction tho",
    tags: ["NO"]
  },
  {
    user: "drlaminar",
    rating: 5,
    time: "13 days ago",
    text: "Hits and Fires on All Cylinders 0-0 - WE SHALL CALL HER - OL 'GLORY!",
    tags: []
  },
  {
    user: "rdotty",
    rating: 3,
    time: "14 days ago",
    text: "it hit for 50 dollar doordash gift card , robux and telegram stars , overall a calm experience",
    tags: ["NO", "DC"]
  },
  {
    user: "kebin517",
    rating: 3,
    time: "18 days ago",
    text: "If uk sites for this bin hit me on tg @fukdafeds5519",
    tags: []
  },
  {
    user: "somewherefornow",
    rating: 5,
    time: "22 days ago",
    text: "15,000 on Kalshi",
    tags: ["NO"]
  },
  {
    user: "dumpbusta",
    rating: 5,
    time: "24 days ago",
    text: "ole reliable , smacked for sum clothes $300 order",
    tags: ["FG"]
  },
  {
    user: "michaeldeidler",
    rating: 5,
    time: "29 days ago",
    text: "working good for me, no issues so far",
    tags: []
  }
];

const PAGED_REVIEWS = {
  2: [
    {
      user: "carderX",
      rating: 4,
      time: "1 month ago",
      text: "Solid Chase bin, always hits on Stripe gateway without issue.",
      tags: ["NO"]
    },
    {
      user: "anon99",
      rating: 5,
      time: "1 month ago",
      text: "Bypasses OTP verification on major e-commerce platforms.",
      tags: ["FG"]
    },
    {
      user: "slick_rick",
      rating: 2,
      time: "1 month ago",
      text: "Dead on Google Pay since yesterday, watch out.",
      tags: ["DC"]
    }
  ],
  3: [
    {
      user: "ezcheckout",
      rating: 5,
      time: "2 months ago",
      text: "Absolutely legendary BIN. Clean transactions all day.",
      tags: ["NO", "FG"]
    }
  ]
};

export default function CommunityReviews({ binNumber }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(13);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // Calculate stats
  const totalReviewCount = 125 + (reviews.length - INITIAL_REVIEWS.length);
  const averageRating = (
    (125 * 3.4 + reviews.reduce((sum, r) => sum + r.rating, 0) - INITIAL_REVIEWS.reduce((sum, r) => sum + r.rating, 0)) /
    totalReviewCount
  ).toFixed(1);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getPageReviews = () => {
    if (currentPage === 1) return reviews;
    return PAGED_REVIEWS[currentPage] || [
      {
        user: "Anonymous",
        rating: 4,
        time: `${currentPage * 10} days ago`,
        text: "Checked and working. Standard response times.",
        tags: []
      }
    ];
  };

  const toggleTagSelection = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const newReview = {
      user: username.trim() || "Anonymous",
      rating: Number(rating),
      time: "Just now",
      text: reviewText.trim(),
      tags: selectedTags
    };

    setReviews([newReview, ...reviews]);
    setIsModalOpen(false);

    // Reset form
    setUsername("");
    setRating(5);
    setReviewText("");
    setSelectedTags([]);
  };

  const StarRating = ({ rating, interactive = false, onSelect }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            onClick={() => interactive && onSelect(s)}
            className={`w-3.5 h-3.5 ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""} ${
              s <= rating 
                ? "text-amber-400 fill-amber-400" 
                : "text-gray-200 dark:text-gray-700 fill-transparent"
            }`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="glass-panel p-5 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-500" />
            Reviews
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Community notes for this BIN.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-950 text-white text-xs font-bold rounded-lg shadow transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Review
        </button>
      </div>

      {/* Aggregate Rating & Pagination Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900 dark:text-white">{averageRating}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-bold">/ 5</span>
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium block mt-0.5">
            Based on {totalReviewCount} reviews
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className="w-7 h-7 rounded-lg border border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className="w-7 h-7 rounded-lg border border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
        {getPageReviews().map((review, i) => (
          <div 
            key={i} 
            className="p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-200/40 dark:border-gray-850 hover:border-gray-300 dark:hover:border-gray-800 transition-all group/review"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2.5">
                {/* Avatar Placeholder */}
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-450 font-bold text-xs uppercase flex items-center justify-center border border-blue-200/40 dark:border-blue-800/40">
                  {review.user.substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-205 flex items-center gap-1.5">
                    {review.user}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StarRating rating={review.rating} />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono font-medium shrink-0">
                {review.time}
              </span>
            </div>

            <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed font-sans font-medium whitespace-pre-line pl-0.5">
              {review.text}
            </p>

            {review.tags && review.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2.5 pl-0.5">
                {review.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      tag === 'NO' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-200/50 dark:border-teal-900/30' :
                      tag === 'DC' ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30' :
                      'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-900/30'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Review Dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 relative overflow-hidden animate-scale-up">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-650 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Add Community Review
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Add your notes or performance feedback for BIN prefix <span className="font-mono font-bold">{binNumber}</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Username</label>
                <input
                  type="text"
                  placeholder="Anonymous"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-250 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Rating</label>
                <div className="flex items-center gap-2">
                  <StarRating rating={rating} interactive={true} onSelect={setRating} />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{rating} out of 5</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Review / Notes</label>
                <textarea
                  required
                  placeholder="Type your notes here..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-250 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Tags</label>
                <div className="flex gap-2">
                  {['NO', 'DC', 'FG'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTagSelection(tag)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        selectedTags.includes(tag)
                          ? tag === 'NO' ? 'bg-teal-500 border-teal-600 text-white shadow' :
                            tag === 'DC' ? 'bg-orange-500 border-orange-600 text-white shadow' :
                            'bg-green-500 border-green-600 text-white shadow'
                          : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-650 dark:text-gray-300 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-950 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
