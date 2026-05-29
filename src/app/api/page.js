import ApiDocsClient from '@/components/ApiDocsClient';

export const metadata = {
  title: 'Free Credit Card BIN Checker API & BIN Database Download | CC Bins',
  description: 'Integrate the public card BIN lookup API for real-time issuer identification. Buy the complete BIN database in CSV/SQL formats. Secure, fast, PCI-DSS compliant.',
  alternates: { canonical: 'https://ccbins.co/api' },
  openGraph: {
    title: 'Free BIN Lookup API & Database Download | CC Bins',
    description: 'Real-time card BIN lookup API and offline database download. 376k+ BIN/IIN records in CSV and SQL formats.',
    type: 'website',
    url: 'https://ccbins.co/api',
    images: [{ url: 'https://ccbins.co/og-default.png', width: 1200, height: 630, alt: 'CC Bins BIN API Documentation' }],
  },
  twitter: { card: 'summary_large_image', title: 'BIN Lookup API & Database Download | CC Bins', description: 'Real-time card BIN lookup API with 376k+ verified records.' },
};

export default function ApiDocsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebAPI",
        "@id": "https://ccbins.co/api#webapi",
        "name": "CC Bins Card Lookup API",
        "description": "High-performance public JSON API endpoint to verify credit card Bank Identification Numbers (BIN / IIN) in real-time.",
        "url": "https://ccbins.co/api",
        "documentation": "https://ccbins.co/api",
        "provider": {
          "@type": "Organization",
          "name": "CC Bins",
          "url": "https://ccbins.co"
        }
      },
      {
        "@type": "Product",
        "@id": "https://ccbins.co/api#database",
        "name": "CC Bins Offline Database Download",
        "description": "Complete credit card BIN database for sale containing 376,900+ verified card range prefixes in CSV and MySQL SQL dump formats.",
        "image": "https://ccbins.co/media__1779867407556.png",
        "offers": {
          "@type": "Offer",
          "price": "149.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://ccbins.co"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Developer API Docs & Database",
            "item": "https://ccbins.co/api"
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex-grow flex flex-col py-2 sm:py-6">
      {/* JSON-LD Schema markup for Google and AI engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Breadcrumbs visual navigation trail */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-550" aria-label="Breadcrumb">
        <a href="/" className="hover:text-gray-950 dark:hover:text-white transition-colors">Home</a>
        <span className="text-gray-350 dark:text-gray-800">/</span>
        <span className="text-gray-900 dark:text-white font-bold">Developer API Docs</span>
      </nav>

      <ApiDocsClient />
    </div>
  );
}
