import './globals.css';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import AdsArea from '@/components/AdsArea';
import Footer from '@/components/Footer';
import HeaderClient from '@/components/HeaderClient';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const jetbrains = JetBrains_Mono({ weight: ['400', '600', '800'], subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  metadataBase: new URL('https://ccbins.co'),
  title: {
    default: 'CC Bins - Free Credit Card BIN Lookup & IIN Database',
    template: '%s | CC Bins',
  },
  description: 'Enterprise-grade credit card BIN lookup tool with advanced filtering, bulk lookup capabilities, and a massive 376k+ BIN/IIN database. Free, fast, PCI-DSS compliant.',
  // Sitewide OG fallback — pages without their own OG image will use this
  openGraph: {
    siteName: 'CC Bins',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'CC Bins — Free Credit Card BIN Lookup & IIN Database' }],
  },
  // Sitewide Twitter card fallback
  twitter: {
    card: 'summary_large_image',
    site: '@ccbins',
    creator: '@ccbins',
  },
  // robots: allow all (including AI bots via robots.js)
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Organization + WebSite JSON-LD — sitewide entity recognition for Google KG, GEO, AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://ccbins.co/#organization",
                "name": "CC Bins",
                "url": "https://ccbins.co",
                "logo": {
                  "@type": "ImageObject",
                  "@id": "https://ccbins.co/#logo",
                  "url": "https://ccbins.co/logo.png",
                  "width": 200,
                  "height": 200,
                  "caption": "CC Bins"
                },
                "image": { "@id": "https://ccbins.co/#logo" },
                "description": "Enterprise-grade credit card BIN lookup and IIN database with 376,000+ verified card prefixes. Free, PCI-DSS compliant, sub-1ms lookups.",
                "email": "admin@ccbins.co",
                "sameAs": [
                  "https://t.me/mrcheckeradmin"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer support",
                  "email": "admin@ccbins.co"
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://ccbins.co/#website",
                "url": "https://ccbins.co",
                "name": "CC Bins",
                "description": "Free credit card BIN lookup and IIN database",
                "publisher": { "@id": "https://ccbins.co/#organization" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": { "@type": "EntryPoint", "urlTemplate": "https://ccbins.co/?q={search_term_string}" },
                  "query-input": "required name=search_term_string"
                },
                "inLanguage": "en-US"
              }
            ]
          }) }}
        />
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
        
        {/* Header - dynamic Client Component */}
        <HeaderClient />


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
