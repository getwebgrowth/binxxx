import Link from 'next/link';

export default function AdsArea() {
  return (
    <div className="w-full flex flex-col items-center gap-3.5 py-5 px-4 bg-white dark:bg-[#070b13] border-b border-gray-150 dark:border-gray-850 shadow-sm animate-fade-up">
      {/* Top Text Ads */}
      <div className="w-full text-center space-y-2.5 font-bold tracking-wide text-[10px] sm:text-xs">
        {/* Text Slot 1 */}
        <div className="flex justify-center">
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="group inline-flex items-center flex-wrap justify-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase select-none"
          >
            <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[8px] sm:text-[9px] rounded font-mono font-bold mr-1.5 border border-blue-200/50 dark:border-blue-900/30 shrink-0">
              TEXT AD SLOT 1
            </span>
            <span className="filter blur-[3px] opacity-45 font-medium transition-all duration-300 group-hover:opacity-60">
              ELONMONEY.VIP - EXCLUSIVE CVV SHOP | DAILY UPDATE | SNIFFED CCs | ALL CARDS REF
            </span>
            <span className="ml-1.5 text-[8px] sm:text-[9px] text-blue-500 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">
              [BOOK NOW &rarr;]
            </span>
          </Link>
        </div>
        
        {/* Text Slot 2 */}
        <div className="flex justify-center">
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="group inline-flex items-center flex-wrap justify-center text-gray-500 hover:text-red-650 dark:hover:text-red-400 transition-colors uppercase select-none"
          >
            <span className="px-1.5 py-0.5 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-[8px] sm:text-[9px] rounded font-mono font-bold mr-1.5 border border-red-200/50 dark:border-red-900/30 shrink-0">
              TEXT AD SLOT 2
            </span>
            <span className="filter blur-[3px] opacity-45 font-medium transition-all duration-300 group-hover:opacity-60">
              ROCK CLUB CC SHOP • ONLY FIRSTHAND CC • REFUNDABLE • 24/7 LIVE SUPPORT
            </span>
            <span className="ml-1.5 text-[8px] sm:text-[9px] text-red-550 dark:text-red-400 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">
              [BOOK NOW &rarr;]
            </span>
          </Link>
        </div>
      </div>

      {/* Banner Ads Grid */}
      <div className="w-full max-w-4xl space-y-2 mt-1 select-none">
        {/* Row 1: 3 Banners */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Banner Slot 1 */}
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="block relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all border border-green-200 dark:border-green-950/30 bg-gradient-to-r from-emerald-800 to-green-900 aspect-[4/1] flex items-center justify-center min-h-[45px] sm:min-h-[70px]"
          >
            <img src="/images/ads/shoppy.jpeg" alt="Shoppy Plus" className="absolute inset-0 w-full h-full object-cover filter blur-[4.5px] brightness-[0.35] group-hover:scale-[1.02] transition-all duration-300 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
              <div className="bg-neutral-900/85 text-white font-mono font-black uppercase tracking-widest text-[6px] sm:text-[9px] py-1 px-14 rotate-[-20deg] shadow-md border-y border-white/10 select-none whitespace-nowrap">
                BOOK SLOT 1
              </div>
            </div>
          </Link>
          
          {/* Banner Slot 2 */}
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="block relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all border border-indigo-200 dark:border-indigo-950/30 bg-gradient-to-r from-violet-800 to-indigo-900 aspect-[4/1] flex items-center justify-center min-h-[45px] sm:min-h-[70px]"
          >
            <img src="/images/ads/retroswipe.gif" alt="RetroSwipe" className="absolute inset-0 w-full h-full object-cover filter blur-[4.5px] brightness-[0.35] group-hover:scale-[1.02] transition-all duration-300 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
              <div className="bg-neutral-900/85 text-white font-mono font-black uppercase tracking-widest text-[6px] sm:text-[9px] py-1 px-14 rotate-[-20deg] shadow-md border-y border-white/10 select-none whitespace-nowrap">
                BOOK SLOT 2
              </div>
            </div>
          </Link>

          {/* Banner Slot 3 */}
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="block relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-800 dark:border-gray-900 bg-gradient-to-r from-gray-900 to-black aspect-[4/1] flex items-center justify-center min-h-[45px] sm:min-h-[70px]"
          >
            <img src="/images/ads/free_lookup.png" alt="Free Lookup" className="absolute inset-0 w-full h-full object-cover filter blur-[4.5px] brightness-[0.35] group-hover:scale-[1.02] transition-all duration-300 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
              <div className="bg-neutral-900/85 text-white font-mono font-black uppercase tracking-widest text-[6px] sm:text-[9px] py-1 px-14 rotate-[-20deg] shadow-md border-y border-white/10 select-none whitespace-nowrap">
                BOOK SLOT 3
              </div>
            </div>
          </Link>
        </div>

        {/* Row 2: 2 Banners */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-3xl mx-auto">
          {/* Banner Slot 4 */}
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="block relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all border border-pink-200 dark:border-pink-950/30 bg-gradient-to-r from-pink-600 to-rose-700 aspect-[5/1] flex items-center justify-center min-h-[45px] sm:min-h-[70px]"
          >
            <img src="/images/ads/ronaldo.png" alt="Ronaldo Club" className="absolute inset-0 w-full h-full object-cover filter blur-[4.5px] brightness-[0.35] group-hover:scale-[1.02] transition-all duration-300 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
              <div className="bg-neutral-900/85 text-white font-mono font-black uppercase tracking-widest text-[6px] sm:text-[9px] py-1 px-14 rotate-[-20deg] shadow-md border-y border-white/10 select-none whitespace-nowrap">
                BOOK SLOT 4
              </div>
            </div>
          </Link>

          {/* Banner Slot 5 */}
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="block relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all border border-blue-200 dark:border-blue-950/30 bg-gradient-to-r from-blue-700 to-indigo-800 aspect-[5/1] flex items-center justify-center min-h-[45px] sm:min-h-[70px]"
          >
            <img src="/images/ads/cerberux.png" alt="Cerberux Club" className="absolute inset-0 w-full h-full object-cover filter blur-[4.5px] brightness-[0.35] group-hover:scale-[1.02] transition-all duration-300 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
              <div className="bg-neutral-900/85 text-white font-mono font-black uppercase tracking-widest text-[6px] sm:text-[9px] py-1 px-14 rotate-[-20deg] shadow-md border-y border-white/10 select-none whitespace-nowrap">
                BOOK SLOT 5
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Text Ads */}
      <div className="w-full text-center space-y-2.5 font-bold tracking-wide text-[10px] sm:text-xs mt-1">
        {/* Text Slot 3 */}
        <div className="flex justify-center">
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="group inline-flex items-center flex-wrap justify-center text-gray-500 hover:text-blue-650 dark:hover:text-blue-400 transition-colors uppercase select-none"
          >
            <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[8px] sm:text-[9px] rounded font-mono font-bold mr-1.5 border border-blue-200/50 dark:border-blue-900/30 shrink-0">
              TEXT AD SLOT 3
            </span>
            <span className="filter blur-[3px] opacity-45 font-medium transition-all duration-300 group-hover:opacity-60">
              StormCheck • Blazing Fast Checker • Zero Logs, $0 Charge, Cheap and FAST
            </span>
            <span className="ml-1.5 text-[8px] sm:text-[9px] text-blue-550 dark:text-blue-400 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">
              [BOOK NOW &rarr;]
            </span>
          </Link>
        </div>
        
        {/* Text Slot 4 */}
        <div className="flex justify-center">
          <Link 
            href="/tools/book-ad" 
            rel="nofollow sponsored" 
            className="group inline-flex items-center flex-wrap justify-center text-gray-500 hover:text-purple-650 dark:hover:text-purple-400 transition-colors uppercase select-none"
          >
            <span className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-[8px] sm:text-[9px] rounded font-mono font-bold mr-1.5 border border-purple-200/50 dark:border-purple-900/30 shrink-0">
              TEXT AD SLOT 4
            </span>
            <span className="filter blur-[3px] opacity-45 font-medium transition-all duration-300 group-hover:opacity-60">
              Jerry's CC+CVV Store • Excellent Bases • The Only Store With AVS Checker
            </span>
            <span className="ml-1.5 text-[8px] sm:text-[9px] text-purple-550 dark:text-purple-400 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">
              [BOOK NOW &rarr;]
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
