import { Star, Clock, TrendingUp, Users, ChevronRight, List } from "lucide-react";

export const metadata = {
  title: 'Discover Credit Card BIN Lists & Reviews | CC Bins',
  description: 'Explore the most searched card BINs, top reviewers, recent reviews, and public credit card BIN lists on CC Bins.',
  keywords: 'BIN lookup, card prefix, community reviews, top reviewers, bin lists, bin list database, credit card bin list',
  alternates: {
    canonical: 'https://ccbins.co/discover',
  }
};

const MOST_REVIEWED_BINS = [
  { bin: "414720", brand: "visa", description: "CREDIT - Traditional - JPMORGAN CHASE BANK N.A.", rating: 3.4, reviews: 125 },
  { bin: "517805", brand: "mastercard", description: "CREDIT - World - CAPITAL ONE, NATIONAL ASSOCIATION", rating: 3.2, reviews: 75 },
  { bin: "440066", brand: "visa", description: "CREDIT - Traditional - BANK OF AMERICA - CONSUMER CRE...", rating: 3.0, reviews: 60 },
  { bin: "414709", brand: "visa", description: "CREDIT - Traditional - CAPITAL ONE, NATIONAL ASSOCIATION", rating: 3.0, reviews: 56 },
  { bin: "546616", brand: "mastercard", description: "CREDIT - World - CITIBANK N.A.", rating: 2.0, reviews: 55 },
  { bin: "601100", brand: "discover", description: "CREDIT - Platinum - DISCOVER ISSUER", rating: 3.3, reviews: 51 },
];

const TOP_REVIEWERS = [
  { username: "searchmotor", reviews: 495, rank: "#1", avatar: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-indigo-600" },
  { username: "planetkyc", reviews: 402, rank: "#2", avatar: "bg-gradient-to-tr from-blue-400 to-indigo-600" },
  { username: "riza", reviews: 355, rank: "#3", avatar: "bg-gradient-to-tr from-zinc-700 to-slate-900" },
  { username: "filn", reviews: 354, avatar: "bg-gradient-to-tr from-teal-400 to-emerald-600" },
  { username: "bricks", reviews: 345, avatar: "bg-gradient-to-tr from-orange-400 to-amber-500" },
  { username: "mihnme", reviews: 336, avatar: "bg-gradient-to-tr from-red-500 via-blue-500 to-yellow-500" },
];

const RECENT_REVIEWS = [
  { bin: "341159", brand: "amex", rating: 4, text: "hitting LootBar", user: "taylor", time: "about 21 hours ago" },
  { bin: "412650", brand: "visa", rating: 3, text: "", user: "taylor", time: "about 24 hours ago" },
  { bin: "412648", brand: "visa", rating: 4, text: "errors in casino sites", user: "taylor", time: "about 24 hours ago" },
  { bin: "370372", brand: "amex", rating: 5, text: "3 cashout then dies", user: "mihnme", time: "1 day ago" },
  { bin: "370371", brand: "amex", rating: 5, text: "do not exceed 400 once", user: "mihnme", time: "1 day ago" },
  { bin: "370370", brand: "amex", rating: 4, text: "Eneba is back with ts bin", user: "mihnme", time: "1 day ago" },
  { bin: "271796", brand: "mastercard", rating: 4, text: "smacking shopify with new acc", user: "mihnme", time: "1 day ago" },
  { bin: "234090", brand: "mastercard", rating: 5, text: "best casino enroll", user: "mihnme", time: "1 day ago" },
  { bin: "233009", brand: "mastercard", rating: 4, text: "cashapp linkable", user: "mihnme", time: "1 day ago" },
];

const RECENT_LISTS = [
  { title: "gift cards bins", description: "for method, @Hale_ron", bins: 2, user: "taylor", time: "about 23 hours ago", gradient: "from-orange-400 to-amber-500" },
  { title: "crypto bins", description: "method -> TG @Hale_ron", bins: 4, user: "taylor", time: "about 23 hours ago", gradient: "from-blue-400 to-indigo-500" },
  { title: "Mxbin", description: "", bins: 195, user: "l3tr4mmnf", time: "1 day ago", gradient: "from-pink-400 to-rose-500" },
  { title: "CN VISA MASTER", description: "", bins: 883, user: "abzzcc76", time: "3 days ago", gradient: "from-lime-400 to-green-500" },
  { title: "1k v", description: "", bins: 1047, user: "ling", time: "4 days ago", gradient: "from-purple-400 to-violet-600" },
  { title: "CASH TRANSFER BINS", description: "Best Wire transfers,Checking bins hit me up for methods @Datanomadd", bins: 33, user: "blncc", time: "4 days ago", gradient: "from-cyan-400 to-teal-500" },
  { title: "buniy", description: "", bins: 49, user: "hitmyapiofflmao", time: "4 days ago", gradient: "from-indigo-400 to-purple-500" },
  { title: "Fresh Bins", description: "https://t.me/moneyg3ng", bins: 10, user: "mugs", time: "4 days ago", gradient: "from-sky-400 to-blue-600" },
  { title: "ggty bins", description: "https://t.me/moneyg3ng", bins: 10, user: "mugs", time: "4 days ago", gradient: "from-red-400 to-orange-500" },
  { title: "High balance bins", description: "For premium bins and method, hit me up @zuwaep", bins: 22, user: "bricks", time: "4 days ago", gradient: "from-teal-400 to-emerald-600" },
];

const VisaLogo = () => (
  <svg className="w-10 h-auto text-[#1a1f71] dark:text-white fill-current" viewBox="0 0 130 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.4128 41.0541H21.1928L12.7791 8.95549C12.3798 7.47895 11.5319 6.17361 10.2846 5.55839C7.17185 4.01231 3.74183 2.78186 0 2.16129V0.925493H18.0746C20.5691 0.925493 22.4401 2.78186 22.7519 4.93782L27.1174 28.0916L38.3319 0.925493H49.2401L32.4128 41.0541ZM55.4767 41.0541H44.8803L53.6058 0.925493H64.2022L55.4767 41.0541ZM77.9109 12.0423C78.2227 9.88101 80.0936 8.64522 82.2763 8.64522C85.7063 8.33493 89.4427 8.9555 92.5609 10.4962L94.4318 1.85637C91.3136 0.620572 87.8836 0 84.7709 0C74.4863 0 67.0026 5.5584 67.0026 13.2728C67.0026 19.1415 72.3036 22.2229 76.0454 24.0793C80.0936 25.9303 81.6527 27.1661 81.3409 29.0171C81.3409 31.7936 78.2227 33.0294 75.11 33.0294C71.3681 33.0294 67.6263 32.1039 64.2017 30.5578L62.3308 39.2031C66.0727 40.7438 70.1208 41.3644 73.8627 41.3644C85.3945 41.6693 92.5609 36.1163 92.5609 27.7813C92.5609 17.2851 77.9109 16.6699 77.9109 12.0423V12.0423ZM129.646 41.0541L121.232 0.925493H112.195C110.324 0.925493 108.453 2.16129 107.83 4.01231L92.2495 41.0541H103.158L105.335 35.1907H118.738L119.985 41.0541H129.646ZM113.754 11.732L116.867 26.8558H108.141L113.754 11.732Z" />
  </svg>
);

const MastercardLogo = () => (
  <svg className="w-10 h-auto shrink-0" viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.2" cy="9" r="6.2" fill="#EB001B" />
    <circle cx="15.8" cy="9" r="6.2" fill="#FF5F00" />
    <path d="M12,4.8C10.7,6 9.9,7.6 9.9,9.5c0,1.9 0.8,3.5 2.1,4.7c1.3-1.2 2.1-2.8 2.1-4.7C14.1,7.6 13.3,6 12,4.8z" fill="#F79E1B" />
  </svg>
);

const DiscoverLogo = () => (
  <svg className="w-12 h-auto shrink-0" viewBox="0 0 86 16" xmlns="http://www.w3.org/2000/svg">
    <g fill="#222" className="dark:fill-white">
      <path d="M7.4,0H0v16h7.4c4.3,0,7.6-2.6,7.6-8S11.7,0,7.4,0z M7,13.1H3V2.9h4c2.5,0,4.2,1.3,4.2,5.1S9.5,13.1,7,13.1z"/>
      <polygon points="17.9,0 17.9,16 21.9,16 21.9,0"/>
      <path d="M31.2,5c-1.3-1.1-2.9-1.7-4.8-1.7c-3.1,0-5.3,2.2-5.3,5.2s2.2,5.2,5.3,5.2c1.9,0,3.5-0.6,4.8-1.7v-2.2h-4.8V7.3h8.6v6.4c-2.2,1.8-5,2.6-8,2.6c-5.4,0-9-3.2-9-8.3s3.6-8.3,9-8.3c3,0,5.8,0.8,8,2.6L31.2,5z"/>
      <path d="M51.9,0l-5.1,13.8L41.7,0h-4.2l7.1,16h4.3L56,0H51.9z"/>
      <polygon points="57.2,0 57.2,16 68.6,16 68.6,12.9 61.2,12.9 61.2,9.5 67.8,9.5 67.8,6.4 61.2,6.4 61.2,3.1 68.6,3.1 68.6,0"/>
      <path d="M78.6,0h-6.8v16h4V9.8h2.3c2.9,0,4.4,1.3,4.9,3.7c0.4,1.7,0.7,2.5,0.7,2.5h4.2c0,0-0.4-1.2-0.8-3c-0.6-2.4-2.2-3.8-4.9-4.2c2.4-0.6,3.7-2,3.7-4.4C85.9,1.7,82.9,0,78.6,0z M78,6.8h-2.2V3.1H78c1.6,0,2.6,0.5,2.6,1.9S79.6,6.8,78,6.8z"/>
    </g>
    <path d="M39.6,8c0-2.9-2.1-4.7-4.8-4.7s-4.8,1.8-4.8,4.7s2.1,4.7,4.8,4.7S39.6,10.9,39.6,8z" fill="#f47920"/>
  </svg>
);

const AmexLogo = () => (
  <svg className="w-10 h-auto shrink-0 rounded" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" fill="#0070d2" />
    <text x="1.5" y="9.5" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="5.2" letterSpacing="0.1">AMERICAN</text>
    <text x="1.5" y="15.5" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="5.2" letterSpacing="0.1">EXPRESS</text>
  </svg>
);

const BrandIcon = ({ brand }) => {
  const brandLower = (brand || "").toLowerCase();
  let content;
  if (brandLower.includes("visa")) {
    content = <VisaLogo />;
  } else if (brandLower.includes("mastercard")) {
    content = <MastercardLogo />;
  } else if (brandLower.includes("amex") || brandLower.includes("american express")) {
    content = <AmexLogo />;
  } else if (brandLower.includes("discover")) {
    content = <DiscoverLogo />;
  } else {
    content = <span className="text-[9px] font-extrabold text-gray-400 font-mono uppercase">CARD</span>;
  }

  return (
    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 shrink-0 shadow-sm">
      {content}
    </div>
  );
};

export default function DiscoverPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Discover BINs & Community Reviews",
    "description": "Explore the most searched card BINs, top reviewers, recent reviews, and public BIN lists on CC Bins.",
    "url": "https://ccbins.co/discover",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 6,
      "itemListElement": MOST_REVIEWED_BINS.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": `BIN ${item.bin} - ${item.description}`
      }))
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col animate-fade-up space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Discover BINs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
            Explore the most searched BINs, community reviews, and verified data leaks.
          </p>
        </div>
      </div>

      {/* Most Reviewed BINs */}
      <div className="glass-panel p-6 sm:p-8">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          Most Reviewed BINs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {MOST_REVIEWED_BINS.map((item) => (
            <a key={item.bin} href={`/bin/${item.bin}`} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-2xl transition-all shadow-sm hover:shadow-md group">
              <BrandIcon brand={item.brand} />
              <div className="min-w-0 flex-1">
                <span className="font-mono text-base font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.bin}
                </span>
                <p className="text-[10px] text-gray-500 dark:text-gray-450 font-semibold truncate mt-0.5">
                  {item.description}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{item.rating}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">• {item.reviews} reviews</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Top Reviewers */}
      <div className="glass-panel p-6 sm:p-8">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-500" />
          Top Reviewers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {TOP_REVIEWERS.map((rev) => (
            <div key={rev.username} className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 hover:border-gray-250 dark:hover:border-gray-800 rounded-2xl transition-all shadow-sm group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${rev.avatar} flex items-center justify-center text-white font-extrabold text-xs shadow-inner`}>
                  {rev.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors block">
                    @{rev.username}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    {rev.reviews} reviews
                  </span>
                </div>
              </div>
              {rev.rank && (
                <span className={`text-xs font-mono font-black uppercase px-2 py-0.5 rounded-lg ${
                  rev.rank === "#1" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30" :
                  rev.rank === "#2" ? "bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/30" :
                  "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30"
                }`}>
                  {rev.rank}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="glass-panel p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Recent Reviews
          </h2>
          <a href="/reviews" className="text-xs font-bold text-blue-600 dark:text-blue-405 hover:underline flex items-center gap-0.5">
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {RECENT_REVIEWS.map((item, idx) => (
            <a key={idx} href={`/bin/${item.bin}`} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 hover:border-gray-200 dark:hover:border-gray-800 rounded-2xl transition-all shadow-sm hover:shadow-md group">
              <BrandIcon brand={item.brand} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.bin}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{item.rating}</span>
                  </div>
                </div>
                {item.text ? (
                  <p className="text-xs text-gray-650 dark:text-gray-305 font-medium leading-relaxed mt-1.5 line-clamp-2">
                    "{item.text}"
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-550 italic leading-relaxed mt-1.5">
                    No review text left
                  </p>
                )}
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono font-medium mt-2">
                  by <span className="font-bold text-gray-500 dark:text-gray-450">@{item.user}</span> • {item.time}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent BIN Lists */}
      <div className="glass-panel p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <List className="w-4 h-4 text-purple-500" />
            Recent BIN Lists
          </h2>
          <a href="/lists" className="text-xs font-bold text-blue-600 dark:text-blue-405 hover:underline flex items-center gap-0.5">
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="space-y-4 divide-y divide-gray-150 dark:divide-gray-800/80">
          {RECENT_LISTS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} shrink-0 shadow-sm flex items-center justify-center`} />
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-850 dark:text-gray-200 text-sm truncate max-w-[280px] sm:max-w-[400px]">
                    {item.title}
                  </h4>
                  {item.description ? (
                    <p className="text-xs text-gray-500 dark:text-gray-450 truncate mt-0.5 max-w-[280px] sm:max-w-[400px]">
                      {item.description}
                    </p>
                  ) : (
                    <span className="text-[10px] text-gray-450 dark:text-gray-550 block mt-0.5">Public bin list</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
                  {item.bins} BINs
                </span>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-medium">
                  by <span className="font-bold text-gray-500 dark:text-gray-450">@{item.user}</span> • {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
