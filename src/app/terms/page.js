import { FileText, Scale, Ban, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - CC Bins Reference Database',
  description: 'Review CC Bins terms of use, search limits, API rate limiting policies, database usage guidelines, and database warranties disclaimer.',
  alternates: {
    canonical: 'https://ccbins.co/terms',
  }
};

export default function TermsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ccbins.co/terms#webpage",
        "url": "https://ccbins.co/terms",
        "name": "Terms of Service - CC Bins",
        "description": "Standard agreements and rules governing credit card BIN lookups and database integrations."
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ccbins.co/terms#breadcrumb",
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
            "name": "Terms of Service",
            "item": "https://ccbins.co/terms"
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex-grow flex flex-col max-w-4xl mx-auto py-2 sm:py-6 animate-fade-up">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-550" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-950 dark:hover:text-white transition-colors">Home</Link>
        <span className="text-gray-350 dark:text-gray-800">/</span>
        <span className="text-gray-900 dark:text-white font-bold">Terms of Service</span>
      </nav>

      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-450 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to lookup tool
        </Link>
      </div>

      {/* Content Layout */}
      <div className="glass-panel p-6 sm:p-10 border border-gray-250/50 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 relative overflow-hidden space-y-8">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl -z-10" />

        {/* Title Header */}
        <div className="border-b border-gray-150 dark:border-gray-850 pb-6 space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Terms of Service
          </h1>
          <p className="text-xs text-gray-455 dark:text-gray-500 font-mono">
            Last Updated: May 27, 2026 • Terms Version 1.1
          </p>
        </div>

        {/* Content Blocks */}
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-650 dark:text-gray-300 space-y-6 leading-relaxed">
          <p className="text-sm leading-relaxed">
            Welcome to <strong>CC Bins</strong>. By accessing our web application, developer documentation, REST endpoints, or buying our offline databases, you agree to comply with and be bound by the following terms and conditions of use.
          </p>

          {/* Section 1 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-blue-500" />
              1. Permitted Database Usage
            </h2>
            <p className="text-xs sm:text-sm">
              CC Bins is provided as a payments routing reference search engine. It is designed to assist risk compliance managers, gateway integration engineers, and checkout security systems in identifying issuing card networks, card funding subclasses (debit/credit/prepaid), and countries of origin. 
            </p>
            <p className="text-xs sm:text-sm">
              Queries should be conducted manually or integrated via verified API paths using accepted parameters (exactly 6 to 8 digit numeric prefixes).
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Ban className="w-4.5 h-4.5 text-red-500" />
              2. Strict Prohibitions & Anti-Scraping Policies
            </h2>
            <p className="text-xs sm:text-sm">
              To protect database stability and prevent resources abuse, the following actions are strictly prohibited:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 font-medium">
              <li>**Credential Stuffing & Carding Audits:** Using the lookup endpoints in connection with card cracking scripts, credential brute-forcing, or raw checkout testing is illegal and will lead to an immediate ban.</li>
              <li>**Bulk Automated Scraping:** Automated script crawling or bulk pasting loops designed to extract card records from our interface without authorization is prohibited. </li>
              <li>**API Query Capping:** Our standard developer sandbox limits unauthenticated IPs to **10 requests per minute**, and internal search endpoint is limited to **60 requests per minute**. Attempts to circumvent these limits via proxy rotations will lead to permanent IP blocking.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-amber-500" />
              3. Disclaimer of Warranties
            </h2>
            <p className="text-xs sm:text-sm">
              CC Bins card lookup parameters and dataset listings are provided on an **"as-is" and "as-available"** basis. While our engineering team performs daily dynamic synchronization checks to ensure card registry records are accurate, card issuer bank routing rules update frequently.
            </p>
            <p className="text-xs sm:text-sm">
              We make no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, reliability, or availability of the BIN database records. Any reliance you place on such information is strictly at your own risk.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              4. Service Modifications
            </h2>
            <p className="text-xs sm:text-sm">
              We reserve the right to alter, pause, rate-limit, or discontinue any public search endpoints, sandbox environments, or site views at any time without notice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
