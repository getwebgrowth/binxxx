import { Shield, Lock, Eye, Cookie, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - CC Bins Card Verification Platform',
  description: 'Understand CC Bins privacy compliance rules, PCI-DSS sandbox data standards, and read how we manage safe bin lookups without storing cardholder details.',
  alternates: { canonical: 'https://ccbins.co/privacy' },
  openGraph: {
    title: 'Privacy Policy | CC Bins',
    description: 'How CC Bins handles your data — PCI-DSS compliant BIN lookup with zero cardholder data stored.',
    type: 'website',
    url: 'https://ccbins.co/privacy',
    images: [{ url: 'https://ccbins.co/og-default.png', width: 1200, height: 630, alt: 'CC Bins Privacy Policy' }],
  },
  twitter: { card: 'summary', title: 'Privacy Policy | CC Bins', description: 'PCI-DSS compliant BIN lookup with zero cardholder data stored.' },
};

export default function PrivacyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ccbins.co/privacy#webpage",
        "url": "https://ccbins.co/privacy",
        "name": "Privacy Policy - CC Bins",
        "description": "Information on data collection, processing compliance, and security policies for CC Bins lookup operations."
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ccbins.co/privacy#breadcrumb",
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
            "name": "Privacy Policy",
            "item": "https://ccbins.co/privacy"
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
        <span className="text-gray-900 dark:text-white font-bold">Privacy Policy</span>
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
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-450 dark:text-gray-500 font-mono">
            Last Updated: May 27, 2026 • Policy Version 1.2
          </p>
        </div>

        {/* Content Blocks */}
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-650 dark:text-gray-300 space-y-6 leading-relaxed">
          <p className="text-sm leading-relaxed">
            At <strong>CC Bins</strong>, accessible from <Link href="/" className="text-blue-600 hover:underline">https://ccbins.co</Link>, one of our main priorities is the privacy of our visitors and integrating systems that comply with standard credit card security protocols. This Privacy Policy document outlines the types of data that are collected, processed, and maintained during your database query sessions.
          </p>

          {/* Section 1 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-blue-500" />
              1. PCI-DSS Data Compliance & Sandbox Standards
            </h2>
            <p className="text-xs sm:text-sm">
              Under the <em>Payment Card Industry Data Security Standard (PCI-DSS)</em>, checking or verifying Bank Identification Numbers (BINs) is fully compliant as long as no sensitive customer assets are processed. 
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 font-medium">
              <li>We strictly process and look up only the public **6-digit or 8-digit range prefix** of a card number.</li>
              <li>We **never collect, store, log, or transmit** full Primary Account Numbers (PANs), cardholder names, expiration dates, or CVV/CVC security codes.</li>
              <li>There is no possibility of credit card data exposure or theft on our system, as our databases have zero knowledge of individual financial accounts.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4.5 h-4.5 text-purple-500" />
              2. Data We Process & Purpose of Logs
            </h2>
            <p className="text-xs sm:text-sm">
              When you use our search features, playground sandbox, or GET API endpoint, we temporarily receive network attributes which are handled under strict constraints:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 font-medium">
              <li><strong>Client IP Addresses:</strong> Incoming IP addresses are logged inside an in-memory sliding-window cache. This is strictly required to enforce our rate limit protections (10 reqs/min for API, 60 reqs/min for website lookup) to block malicious crawler scripts.</li>
              <li><strong>Temporary Log Pruning:</strong> These rate limit tracking logs are not stored persistently and are automatically deleted from memory within 5 to 10 minutes.</li>
              <li><strong>No Third-Party Tracker Analytics:</strong> We value your privacy and do not embed telemetry trackers, marketing scripts, or third-party ads networks that scan user behavior.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Cookie className="w-4.5 h-4.5 text-emerald-500" />
              3. Cookies Policy
            </h2>
            <p className="text-xs sm:text-sm">
              CC Bins utilizes cookies in an extremely minimal capacity:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 font-medium">
              <li>We do not write tracking or advertising profiling cookies.</li>
              <li>We utilize native localStorage elements strictly to store user preferences such as your choice of visual mode (**Dark Mode vs. Light Mode**).</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              4. Contact Privacy Officer
            </h2>
            <p className="text-xs sm:text-sm">
              If you have additional questions or require more information about our privacy procedures, do not hesitate to contact our data compliance coordinator at <a href="mailto:admin@ccbins.co" className="text-blue-600 hover:underline">admin@ccbins.co</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
