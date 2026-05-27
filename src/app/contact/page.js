import { Mail, Send, MessageSquare, Info, ArrowLeft, ArrowUpRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - CC Bins Technical Support & Inquiries',
  description: 'Get in touch with the CC Bins team. Contact us for bulk API key limits, offline database download purchases, advertisement bookings, and dataset updates.',
  alternates: {
    canonical: 'https://ccbins.co/contact',
  }
};

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ccbins.co/contact#webpage",
        "url": "https://ccbins.co/contact",
        "name": "Contact CC Bins Team",
        "description": "Reach out to CC Bins compliance, developer support, and advertisement teams."
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ccbins.co/contact#breadcrumb",
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
            "name": "Contact Us",
            "item": "https://ccbins.co/contact"
          }
        ]
      }
    ]
  };

  const contactChannels = [
    {
      title: "Email Assistance",
      description: "For data inaccuracies reports, enterprise key requests, and compliance audits.",
      value: "contact@ccbins.co",
      link: "mailto:contact@ccbins.co",
      icon: <Mail className="w-5 h-5 text-blue-500" />,
      cta: "Send Email"
    },
    {
      title: "Telegram Support",
      description: "For rapid settlement activation on database sales and sponsored ad placements.",
      value: "@mrcheckeradmin",
      link: "https://t.me/mrcheckeradmin",
      icon: <Send className="w-5 h-5 text-indigo-500" />,
      cta: "Open Chat"
    }
  ];

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
        <span className="text-gray-900 dark:text-white font-bold">Contact Us</span>
      </nav>

      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-450 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to lookup tool
        </Link>
      </div>

      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/30 rounded-full border border-blue-200/40 dark:border-blue-900/30 shadow-sm">
            Technical Support Desk
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Contact the CC Bins Team
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
            Have questions about database purchases, custom API limits, or sponsor ads? Reach out to our operators directly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contactChannels.map((channel, i) => (
            <div key={i} className="glass-panel p-6 bg-white/50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-850 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-150 dark:border-gray-800 shadow-sm">
                  {channel.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-gray-950 dark:text-white">{channel.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">{channel.description}</p>
                </div>
                <div className="text-xs font-mono font-bold text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-150 dark:border-gray-800 w-fit">
                  {channel.value}
                </div>
              </div>
              <div className="pt-6">
                <a
                  href={channel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center inline-flex items-center justify-center gap-1 py-2.5 bg-gray-900 hover:bg-black dark:bg-gray-850 dark:hover:bg-gray-800 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  {channel.cta}
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Help Card */}
        <div className="glass-panel p-6 sm:p-8 bg-white/50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-850 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            Inquiry Guidelines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-650 dark:text-gray-300 leading-relaxed font-medium">
            <div className="space-y-3">
              <div>
                <span className="block font-bold text-gray-900 dark:text-white mb-0.5">Database Download Sales</span>
                Orders for the offline dataset download (~37.0 MB, 376k+ rows in CSV/SQL) are completed manually. Contact Telegram support for payment address settlements (Bitcoin/USDT). Delivery link is provided instantly upon verification.
              </div>
              <div>
                <span className="block font-bold text-gray-900 dark:text-white mb-0.5">API Limit Extensions</span>
                If you are a corporate merchant and require dedicated API credentials exceeding our standard unauthenticated sandbox limits (10 reqs/min), email us your traffic specifications and usage logs.
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="block font-bold text-gray-900 dark:text-white mb-0.5">Ad Bookings Activation</span>
                Sponsorship slots can be set up immediately. After submitting your campaign banner/link details via the sponsorship tool dashboard, message the Telegram admin with your order info package to coordinate.
              </div>
              <div>
                <span className="block font-bold text-gray-900 dark:text-white mb-0.5">Data Inaccuracy Reports</span>
                To submit an update for an issuing bank's card range parameters, provide the specific BIN, card network, issuing bank's domain registry record, and country of origin. Verified edits are integrated into daily sync releases.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
