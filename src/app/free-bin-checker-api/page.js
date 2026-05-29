import ApiDocsClient from '@/components/ApiDocsClient';

/* ─── Schema Markup ────────────────────────────────────────────────────── */

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://ccbins.co/free-bin-checker-api#app",
      "name": "CC Bins Free BIN Checker API",
      "description": "Free REST API for credit card BIN lookup and IIN identification. Returns card brand, type, issuing bank, country, and card level for any 6–8 digit BIN prefix. 376,000+ verified records, CORS-enabled, no API key required.",
      "url": "https://ccbins.co/free-bin-checker-api",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free public API — 10 requests/minute per IP. No API key required."
      },
      "provider": {
        "@id": "https://ccbins.co/#organization"
      },
      "featureList": [
        "Free BIN lookup API — no key required",
        "376,000+ verified BIN/IIN records",
        "Returns card brand, type, level, issuing bank, country",
        "CORS-enabled public endpoint",
        "Sub-45ms response time",
        "JSON response format",
        "Rate limit: 10 req/min per IP"
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://ccbins.co/free-bin-checker-api#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a BIN checker API?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A BIN checker API (Bank Identification Number API) is a REST service that accepts the first 6–8 digits of a credit or debit card and returns metadata about that card: the issuing bank, card brand (Visa, Mastercard, Amex), card type (credit, debit, prepaid), card level (Classic, Platinum, Gold), and the country of issuance. This data is used for payment routing, fraud detection, and checkout validation."
          }
        },
        {
          "@type": "Question",
          "name": "Is the CC Bins BIN lookup API free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The CC Bins BIN checker API is completely free to use with no API key required. The public endpoint allows up to 10 requests per minute per IP address. For higher volume or offline access, a complete BIN database download (376,000+ rows, CSV/SQL) is available for $149 one-time."
          }
        },
        {
          "@type": "Question",
          "name": "How do I integrate the BIN lookup API?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Send a GET request to https://ccbins.co/api/v1/bin/{bin} where {bin} is a 6, 7, or 8 digit card prefix. No authentication headers are required. The API returns a JSON object with fields: success, bin, scheme, type, brand, bank (name, phone, url), and country (name, code, flag)."
          }
        },
        {
          "@type": "Question",
          "name": "What is the BIN API rate limit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The free public BIN API is rate-limited to 10 requests per minute per IP address. Exceeding this returns an HTTP 429 Too Many Requests response. Response headers include X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset for programmatic backoff handling."
          }
        },
        {
          "@type": "Question",
          "name": "Can I download the full BIN database?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The complete CC Bins database of 376,938 verified BIN/IIN records is available for purchase as a one-time download in CSV and SQL (MySQL) formats for $149. The download includes weekly update notifications for 12 months via email."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://ccbins.co/free-bin-checker-api#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ccbins.co" },
        { "@type": "ListItem", "position": 2, "name": "Free BIN Checker API", "item": "https://ccbins.co/free-bin-checker-api" }
      ]
    }
  ]
};

/* ─── Metadata ─────────────────────────────────────────────────────────── */

export const metadata = {
  title: 'Free BIN Checker API — Credit Card IIN Lookup REST Endpoint | CC Bins',
  description: 'Free public credit card BIN checker API. Send a GET request to /api/v1/bin/{bin} and get card brand, type, issuing bank, and country in JSON. No API key required. 376k+ BIN/IIN records. CORS-enabled.',
  alternates: {
    canonical: 'https://ccbins.co/free-bin-checker-api',
  },
  openGraph: {
    title: 'Free BIN Checker API — Credit Card IIN Lookup | CC Bins',
    description: 'No-key REST API for credit card BIN/IIN lookups. Returns card network, type, bank & country in under 45ms. 376k+ verified records.',
    type: 'website',
    url: 'https://ccbins.co/free-bin-checker-api',
    images: [{ url: 'https://ccbins.co/og-default.png', width: 1200, height: 630, alt: 'CC Bins Free BIN Checker API' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Credit Card BIN Lookup API | CC Bins',
    description: 'REST API for BIN/IIN lookups — no key required. 376k+ records, CORS-enabled, JSON output.',
  },
};

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function FreeBinCheckerApiPage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* SEO intro text — visible to crawlers, above the interactive client component */}
      <section className="sr-only" aria-label="API documentation summary">
        <h1>Free Credit Card BIN Checker API</h1>
        <p>
          The CC Bins BIN checker API is a free, public REST endpoint for credit card BIN (Bank Identification Number)
          and IIN (Issuer Identification Number) lookups. No API key is required. Simply send a GET request to
          <code>https://ccbins.co/api/v1/bin/&#123;bin&#125;</code> with a 6–8 digit card prefix and receive a
          JSON response containing the card brand (Visa, Mastercard, Amex, Discover), card type (credit, debit, prepaid),
          card level (Classic, Gold, Platinum, Business), issuing bank name and contact, and country of issuance.
        </p>
        <p>
          The database contains over 376,000 verified BIN/IIN records. The API is CORS-enabled for browser-side
          integration and supports up to 10 requests per minute per IP on the free tier.
          For high-volume or offline use cases, the complete BIN database is available as a CSV or SQL download.
        </p>
      </section>

      <ApiDocsClient />
    </>
  );
}
