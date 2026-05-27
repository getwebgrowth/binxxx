import Link from 'next/link';
import { ShieldCheck, Mail, Database, Terminal, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-150 dark:border-gray-850 bg-white/50 dark:bg-gray-950/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Col (5 cols on large screens) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-white font-mono font-bold text-lg tracking-tighter">CC</span>
              </div>
              <span className="font-mono text-xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-gray-750 dark:group-hover:text-gray-350 transition-colors">
                CC Bins
              </span>
            </Link>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              CC Bins is a leading high-performance credit card BIN lookup database and routing validation platform. We provide dynamic, sub-millisecond API query resolutions and offline card datasets.
            </p>
            
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-xl flex gap-3 text-[10px] text-gray-500 dark:text-gray-455 leading-relaxed max-w-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-300 block mb-0.5">PCI-DSS Compliant Database</span>
                Our database stores and queries only public issuer identification range prefixes. We never hold, log, or process individual account holders, numbers, CVVs, or expirations.
              </div>
            </div>
          </div>

          {/* Links Cols (7 cols total, split 3 / 2 / 2) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Col 1 */}
            <div className="space-y-4 text-left">
              <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                Data Directory
              </h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    BIN Lookup
                  </Link>
                </li>
                <li>
                  <Link href="/discover" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Discover Lists
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Payments Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div className="space-y-4 text-left">
              <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                Fintech Tools
              </h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <Link href="/tools" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Tools Directory
                  </Link>
                </li>
                <li>
                  <Link href="/tools/generator" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Card Generator
                  </Link>
                </li>
                <li>
                  <Link href="/tools/book-ad" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Book Sponsorship
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-4 text-left col-span-2 sm:col-span-1">
              <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                Trust & Support
              </h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <Link href="/api" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Developer API
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-gray-400 dark:text-gray-550 font-medium">
          <div className="space-y-1">
            <span>© {new Date().getFullYear()} CC Bins. All rights reserved.</span>
            <span className="block text-[10px] text-gray-400/80">Developed for payments routing audit purposes.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing.txt" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Pricing reference
            </Link>
            <span>•</span>
            <a href="mailto:contact@ccbins.co" className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              contact@ccbins.co
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
