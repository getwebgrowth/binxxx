import ApiDocsClient from '@/components/ApiDocsClient';

export const metadata = {
  title: 'Free Credit Card BIN Checker API & BIN Database For Sale | CC Bins',
  description: 'Integrate the public card BIN lookup API for real-time issuer identification. Buy complete BIN database downloads in CSV/SQL formats. Secure commercial routing.',
  keywords: 'card bin api, credit card bin lookup api, free bin lookup api, iin lookup api, real-time bin checker api, bin list api, buy bin database, bin database download, bin database for sale, premium bin checker pricing',
  alternates: {
    canonical: 'https://ccbins.co/api',
  }
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
