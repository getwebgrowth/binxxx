import './globals.css';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import AdsArea from '@/components/AdsArea';
import ThemeToggle from '@/components/ThemeToggle';
import CommandPaletteTrigger from '@/components/CommandPaletteTrigger';
import Footer from '@/components/Footer';
import Link from 'next/link';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const jetbrains = JetBrains_Mono({ weight: ['400', '600', '800'], subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  metadataBase: new URL('https://ccbins.co'),
  title: 'CC Bins - Premium Credit Card BIN Lookup & Database Reference',
  description: 'Enterprise-grade credit card BIN lookup tool with advanced filtering, bulk lookup capabilities, and a massive 376k+ BIN/IIN database.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            try {
              const stored = localStorage.getItem('theme');
              const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (stored === 'dark' || (!stored && system)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })()
        `}} />
      </head>
      <body className={`${jakarta.variable} ${jetbrains.variable} font-sans min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100`}>
        
        {/* Header - Glassmorphism style */}
        <header className="sticky top-0 z-50 glass-panel border-b border-gray-100 dark:border-gray-800 rounded-none border-x-0 border-t-0 shadow-sm backdrop-blur-xl bg-white/70 dark:bg-gray-950/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-white font-mono font-bold text-lg tracking-tighter">CC</span>
              </div>
              <span className="font-mono text-xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-350 transition-colors">
                CC Bins
              </span>
            </Link>
            
            {/* Nav & Controls */}
            <div className="flex items-center gap-8">
              <nav className="hidden md:flex gap-6 text-[13px] font-semibold text-gray-500 dark:text-gray-400">
                <Link href="/" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">My Bins</Link>
                <Link href="/discover" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">Discover</Link>
                <Link href="/tools" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">Tools</Link>
                <Link href="/api" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">API Docs</Link>
                <Link href="/blog" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">Blog</Link>
                <Link href="/admin" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold">Admin Portal</Link>
              </nav>
              
              <div className="flex items-center gap-3">
                {/* Search Shortcut & Command Palette */}
                <CommandPaletteTrigger />
                {/* Theme Toggle */}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>


        {/* Banners Space */}
        <AdsArea />

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
