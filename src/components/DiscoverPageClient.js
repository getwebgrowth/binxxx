"use client";

import { useState, useEffect } from 'react';
import { Star, Clock, TrendingUp, Users, ChevronRight, List, Loader2, MessageSquare } from "lucide-react";
import Link from 'next/link';

// ---- Brand Logos ----
const VisaLogo = () => (
  <svg className="w-9 h-auto text-[#1a1f71] dark:text-white fill-current" viewBox="0 0 130 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.4128 41.0541H21.1928L12.7791 8.95549C12.3798 7.47895 11.5319 6.17361 10.2846 5.55839C7.17185 4.01231 3.74183 2.78186 0 2.16129V0.925493H18.0746C20.5691 0.925493 22.4401 2.78186 22.7519 4.93782L27.1174 28.0916L38.3319 0.925493H49.2401L32.4128 41.0541ZM55.4767 41.0541H44.8803L53.6058 0.925493H64.2022L55.4767 41.0541ZM77.9109 12.0423C78.2227 9.88101 80.0936 8.64522 82.2763 8.64522C85.7063 8.33493 89.4427 8.9555 92.5609 10.4962L94.4318 1.85637C91.3136 0.620572 87.8836 0 84.7709 0C74.4863 0 67.0026 5.5584 67.0026 13.2728C67.0026 19.1415 72.3036 22.2229 76.0454 24.0793C80.0936 25.9303 81.6527 27.1661 81.3409 29.0171C81.3409 31.7936 78.2227 33.0294 75.11 33.0294C71.3681 33.0294 67.6263 32.1039 64.2017 30.5578L62.3308 39.2031C66.0727 40.7438 70.1208 41.3644 73.8627 41.3644C85.3945 41.6693 92.5609 36.1163 92.5609 27.7813C92.5609 17.2851 77.9109 16.6699 77.9109 12.0423V12.0423ZM129.646 41.0541L121.232 0.925493H112.195C110.324 0.925493 108.453 2.16129 107.83 4.01231L92.2495 41.0541H103.158L105.335 35.1907H118.738L119.985 41.0541H129.646ZM113.754 11.732L116.867 26.8558H108.141L113.754 11.732Z" />
  </svg>
);

const MastercardLogo = () => (
  <svg className="w-9 h-auto shrink-0" viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.2" cy="9" r="6.2" fill="#EB001B" />
    <circle cx="15.8" cy="9" r="6.2" fill="#FF5F00" />
    <path d="M12,4.8C10.7,6 9.9,7.6 9.9,9.5c0,1.9 0.8,3.5 2.1,4.7c1.3-1.2 2.1-2.8 2.1-4.7C14.1,7.6 13.3,6 12,4.8z" fill="#F79E1B" />
  </svg>
);

const AmexLogo = () => (
  <svg className="w-9 h-auto shrink-0 rounded" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" fill="#0070d2" />
    <text x="1.5" y="9.5" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="5.2" letterSpacing="0.1">AMERICAN</text>
    <text x="1.5" y="15.5" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="5.2" letterSpacing="0.1">EXPRESS</text>
  </svg>
);

const BrandIcon = ({ brand }) => {
  const b = (brand || '').toLowerCase();
  let content = <span className="text-[9px] font-extrabold text-gray-400 font-mono uppercase">CARD</span>;
  if (b.includes('visa')) content = <VisaLogo />;
  else if (b.includes('master')) content = <MastercardLogo />;
  else if (b.includes('amex') || b.includes('american')) content = <AmexLogo />;
  return (
    <div className="w-11 h-11 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 shrink-0 shadow-sm">
      {content}
    </div>
  );
};

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const AVATAR_GRADIENTS = [
  'from-yellow-400 via-pink-500 to-indigo-600',
  'from-blue-400 to-indigo-600',
  'from-zinc-700 to-slate-900',
  'from-teal-400 to-emerald-600',
  'from-orange-400 to-amber-500',
  'from-red-500 via-blue-500 to-yellow-500',
];

const RANK_COLORS = [
  'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50',
  'bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border border-slate-200/50',
  'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50',
];

export default function DiscoverPageClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/discover')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topReviewers = data?.topReviewers || [];
  const mostReviewed = data?.mostReviewed || [];
  const recentReviews = data?.recentReviews || [];

  return (
    <div className="w-full flex-grow flex flex-col animate-fade-up space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Discover BINs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
            Explore the most reviewed BINs, top community contributors, and live reviews.
          </p>
        </div>
      </div>

      {/* Most Reviewed BINs */}
      <div className="glass-panel p-6 sm:p-8">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          Most Reviewed BINs
        </h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
        ) : mostReviewed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mostReviewed.map((item) => (
              <Link key={item.bin} href={`/bin/${item.bin}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-2xl transition-all shadow-sm hover:shadow-md group"
              >
                <BrandIcon brand={item.brand || ''} />
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-base font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.bin}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{Number(item.avg_rating || 0).toFixed(1)}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">• {item.review_count} reviews</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-2">
            <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-700" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review a BIN!</p>
            <Link href="/" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline mt-1">Start looking up BINs →</Link>
          </div>
        )}
      </div>

      {/* Top Reviewers */}
      <div className="glass-panel p-6 sm:p-8">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-500" />
          Top Reviewers
        </h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
        ) : topReviewers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topReviewers.map((rev, idx) => (
              <Link
                key={rev.username}
                href={`/profile/${rev.username}`}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 hover:border-purple-200 dark:hover:border-purple-900/50 rounded-2xl transition-all shadow-sm hover:shadow-md group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white font-extrabold text-xs shadow-inner`}>
                    {rev.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors block">
                      @{rev.username}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      {rev.review_count} review{rev.review_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                {idx < 3 && (
                  <span className={`text-xs font-mono font-black uppercase px-2 py-0.5 rounded-lg ${RANK_COLORS[idx]}`}>
                    #{idx + 1}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs font-bold text-gray-400 dark:text-gray-600">
            No reviewers yet. Start reviewing BINs to appear here!
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      <div className="glass-panel p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Recent Reviews
          </h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
        ) : recentReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentReviews.map((item) => (
              <Link key={item.id} href={`/bin/${item.bin}`}
                className="flex items-start gap-4 p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-2xl transition-all shadow-sm hover:shadow-md group"
              >
                <BrandIcon brand={item.brand || ''} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.bin}
                    </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-2.5 h-2.5 ${s <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
                      ))}
                    </div>
                  </div>
                  {item.comment ? (
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1.5 line-clamp-2">"{item.comment}"</p>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-550 italic leading-relaxed mt-1.5">No review text</p>
                  )}
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono font-medium mt-2">
                    by{' '}
                    <Link href={`/profile/${item.username}`} onClick={e => e.stopPropagation()}
                      className="font-bold text-gray-500 dark:text-gray-450 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      @{item.username}
                    </Link>
                    {' '}• {timeAgo(item.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-2">
            <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-700" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">No reviews yet. Look up a BIN and leave a review!</p>
          </div>
        )}
      </div>

      {/* Recent BIN Lists */}
      <RecentListsSection />
    </div>
  );
}

// Separate component to show recent public lists from real DB
function RecentListsSection() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const GRADIENTS = [
    'from-orange-400 to-amber-500', 'from-blue-400 to-indigo-500',
    'from-pink-400 to-rose-500', 'from-lime-400 to-green-500',
    'from-purple-400 to-violet-600', 'from-cyan-400 to-teal-500',
    'from-indigo-400 to-purple-500', 'from-sky-400 to-blue-600',
    'from-red-400 to-orange-500', 'from-teal-400 to-emerald-600',
  ];

  useEffect(() => {
    // Fetch recent public lists via a simple endpoint
    fetch('/api/user/lists/public')
      .then(r => r.json())
      .then(d => { if (d.success) setLists(d.lists); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function timeAgo(dateStr) {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="glass-panel p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <List className="w-4 h-4 text-purple-500" />
          Recent BIN Lists
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-blue-500" /></div>
      ) : lists.length > 0 ? (
        <div className="space-y-4 divide-y divide-gray-150 dark:divide-gray-800/80">
          {lists.map((item, idx) => (
            <Link key={item.id} href={`/list/${item.share_token}`}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} shrink-0 shadow-sm`} />
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-850 dark:text-gray-200 text-sm truncate max-w-[280px] sm:max-w-[400px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </h4>
                  {item.description ? (
                    <p className="text-xs text-gray-500 dark:text-gray-450 truncate mt-0.5 max-w-[280px] sm:max-w-[400px]">{item.description}</p>
                  ) : (
                    <span className="text-[10px] text-gray-450 dark:text-gray-550 block mt-0.5">Public BIN list</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">{item.item_count} BINs</span>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-medium">
                  by <span className="font-bold text-gray-500 dark:text-gray-450">@{item.owner_name}</span> • {timeAgo(item.created_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-xs font-bold text-gray-400 dark:text-gray-600">
          No public lists yet. Create a list in My Bins and set it to Public!
        </div>
      )}
    </div>
  );
}
