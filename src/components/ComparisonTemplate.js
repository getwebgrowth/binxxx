"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  Star,
  Globe,
  Cpu,
  Database,
  Lock,
  BarChart3,
  Headphones,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  Award,
  Users,
  Activity,
  Server,
} from "lucide-react";

/**
 * Premium comparison page template — CC Bins vs. a competitor.
 *
 * Sections:
 *  1. Breadcrumb navigation
 *  2. Hero (gradient, live speed cards, headline, sub-copy)
 *  3. Quick-stat highlights (3-up grid)
 *  4. Extended narrative (competitor-specific, 700 + words)
 *  5. Full-feature comparison table (dynamic rows)
 *  6. Pros (CC Bins) / Cons (Competitor) panel
 *  7. Pricing section
 *  8. Verdict / rating widget
 *  9. FAQ (collapsible)
 * 10. CTA banner
 */
export default function ComparisonTemplate({
  competitorName,
  competitorUrl,
  uniqueSellingPoints = [],
  featuresComparison = {},
  narrativeParagraphs = [],
  competitorLatency = "210ms",
  competitorUptime = "N/A",
  competitorBins = "~400k",
  competitorPricing = "Variable",
  faqs = [],
  competitorSummary = "",
  overallRating = 4.8,
  performanceScore = 95,
  coverageScore = 98,
  complianceScore = 100,
  valueScore = 92,
}) {
  const [openFaq, setOpenFaq] = useState(null);

  // ── Paragraph fallback ──────────────────────────────────────────────────────
  const paragraphs =
    narrativeParagraphs && narrativeParagraphs.length > 0
      ? narrativeParagraphs
      : [
          `Selecting the right Bank Identification Number (BIN) lookup provider can mean the difference between frictionless checkouts and costly payment failures. CC Bins was purpose-built for developers and payment teams who need sub-100ms validation with enterprise-grade reliability. Every component of the CC Bins stack — from its edge-cached resolver network to its PCI-DSS-compliant zero-PII data model — is optimised for production payment pipelines.`,
          `${competitorName} operates in the same space but takes a markedly different architectural approach. Where CC Bins routes each lookup through a globally distributed caching layer, ${competitorName} relies on centralised data centres that introduce additional network hops. The result is a latency gap that widens under high concurrency — exactly the conditions that exist during peak checkout periods or flash-sale traffic spikes.`,
          `Data coverage is equally important. CC Bins maintains over 600,000 active BIN ranges drawn from Visa, Mastercard, American Express, Discover, UnionPay, and a growing catalogue of regional and neobank issuers. The database is refreshed daily from canonical card-network feeds, ensuring that newly issued virtual cards, prepaid products, and commercial card ranges appear without delay. ${competitorName}'s coverage, while adequate for basic use cases, lags behind in neobank and virtual-card detection — an increasingly critical gap as digital-first issuers proliferate.`,
          `Security and compliance shape every design decision at CC Bins. Our API accepts only the first six to eight digits of a card number — the publicly routable BIN segment — and nothing more. We never log sensitive payment data, never store card-holder information, and operate entirely outside the scope of PCI-DSS cardholder data environments. This architecture makes CC Bins a natural fit for organisations pursuing PCI-DSS certification, since integrating our API introduces zero additional compliance scope.`,
          `From a developer-experience perspective, CC Bins offers OpenAPI 3.1 documentation, SDK packages for Node.js, Python, PHP, and Go, plus pre-built Postman collections. Getting from sign-up to your first successful API call takes under five minutes. ${competitorName}'s onboarding, while functional, typically requires more manual configuration and lacks the breadth of language-specific SDKs that modern engineering teams expect.`,
          `Pricing transparency is another area where CC Bins differentiates itself. Plans are flat-rate and published openly on the pricing page — no hidden per-request fees, no surprise overages. Enterprise tiers include dedicated IP allowlists, priority support SLAs, daily CSV snapshots, and offline SQLite database files for air-gapped compliance environments. ${competitorName}'s pricing structure, by contrast, is usage-metered and can become difficult to forecast at scale.`,
          `Ultimately, the right tool depends on your specific workload. If you need a high-throughput, edge-powered BIN validation service with deep issuer coverage, zero compliance overhead, and predictable pricing, CC Bins is built precisely for that mission. If you are evaluating alternatives, we encourage you to benchmark response times, review uptime history, and test data freshness against your own card test sets before committing.`,
        ];

  // ── FAQ fallback ─────────────────────────────────────────────────────────────
  const faqItems =
    faqs && faqs.length > 0
      ? faqs
      : [
          {
            q: `How does CC Bins compare to ${competitorName} on API latency?`,
            a: `CC Bins resolves BIN queries at the network edge in an average of 78 ms globally. ${competitorName} typically returns results in ${competitorLatency}, a gap that compounds under concurrent load. For checkout pages where every millisecond counts, CC Bins' edge architecture provides a meaningful conversion-rate advantage.`,
          },
          {
            q: "How frequently is the CC Bins database updated?",
            a: "CC Bins syncs against canonical card-network feeds every 24 hours. New BIN allocations, issuer re-brands, and card-type reclassifications are reflected the following day. Enterprise subscribers can receive delta CSV exports on a configurable schedule.",
          },
          {
            q: "Is CC Bins PCI-DSS compliant?",
            a: "Yes. CC Bins processes only the public BIN prefix — the first six to eight digits — which is not considered sensitive payment data under PCI-DSS. We store no card-holder data, no CVVs, and no full PANs, placing our API outside the scope of CDE requirements.",
          },
          {
            q: `Can I migrate from ${competitorName} to CC Bins without rewriting my integration?`,
            a: `In most cases, migration takes less than an hour. CC Bins offers a REST endpoint with a JSON response schema that mirrors common industry formats. Our migration guide maps ${competitorName}'s field names to CC Bins' equivalents so you can swap the base URL and authentication headers with minimal code changes.`,
          },
          {
            q: "Does CC Bins offer a free tier?",
            a: "Yes. The free tier supports up to 1,000 lookups per month with no credit card required. Paid plans start from a flat monthly rate that includes higher volume limits, SLA guarantees, and access to advanced metadata fields.",
          },
          {
            q: "What card networks does CC Bins cover?",
            a: "CC Bins covers Visa, Mastercard, American Express, Discover, JCB, UnionPay, Diners Club, Maestro, and a growing list of regional and neobank networks. The database currently tracks over 600,000 active BIN ranges across more than 180 countries.",
          },
        ];

  // ── Score bar helper ──────────────────────────────────────────────────────
  const ScoreBar = ({ label, score, color = "indigo" }) => {
    const colorMap = {
      indigo: "bg-indigo-500",
      emerald: "bg-emerald-500",
      violet: "bg-violet-500",
      amber: "bg-amber-500",
    };
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-gray-900 dark:text-white">{score}/100</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${colorMap[color]} transition-all duration-700`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/compare" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Compare</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-gray-800 dark:text-gray-200 font-medium">CC Bins vs {competitorName}</span>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white shadow-2xl p-6 sm:p-10 lg:p-14">
        {/* background blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.18),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.12),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.4))] pointer-events-none" />
        {/* grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-400/25 backdrop-blur-md uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              In-Depth Comparison
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              CC Bins{" "}
              <span className="text-indigo-400">vs</span>{" "}
              <span className="text-white">{competitorName}</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Side-by-side analysis of API latency, BIN database coverage,
              compliance posture, developer experience, and total cost of
              ownership. Make the informed switch to a faster BIN lookup service.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-900/50 hover:shadow-indigo-500/30 active:scale-[0.98]"
              >
                Try Free BIN Lookup <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#comparison-table"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-sm transition-all backdrop-blur-md"
              >
                View Feature Table
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              {[
                { icon: ShieldCheck, label: "PCI-DSS Safe" },
                { icon: Globe, label: "180+ Countries" },
                { icon: Database, label: "600k+ BIN Ranges" },
                { icon: Activity, label: "99.99% Uptime SLA" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — performance cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* CC Bins card */}
            <div className="p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/70 backdrop-blur-md shadow-xl relative overflow-hidden group hover:border-indigo-400/50 transition-all duration-300">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-300 uppercase tracking-widest">CC Bins</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                  ✓ 99.99% SLA
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Avg API Response</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">78 ms</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[93%]" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { v: "600k+", l: "BIN Ranges" },
                    { v: "Daily", l: "DB Updates" },
                    { v: "Free", l: "API Trial" },
                  ].map(({ v, l }) => (
                    <div key={l} className="text-center">
                      <div className="text-sm font-bold text-white">{v}</div>
                      <div className="text-[10px] text-slate-500">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Competitor card */}
            <div className="p-5 rounded-2xl border border-slate-700/60 bg-slate-950/50 backdrop-blur-sm opacity-80 hover:opacity-95 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {competitorName}
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full">
                  ⚠ No SLA
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Avg API Response</span>
                  <span className="text-red-400 font-mono font-bold text-sm">{competitorLatency}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-rose-400 h-full rounded-full w-[35%]" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { v: competitorBins, l: "BIN Ranges" },
                    { v: "Weekly", l: "DB Updates" },
                    { v: "Limited", l: "API Trial" },
                  ].map(({ v, l }) => (
                    <div key={l} className="text-center">
                      <div className="text-sm font-bold text-slate-400">{v}</div>
                      <div className="text-[10px] text-slate-600">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VS divider */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-700" />
                <div className="w-9 h-9 rounded-full bg-indigo-700 border border-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick-stat highlights ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            icon: Clock,
            color: "blue",
            title: "Sub-100ms Latency",
            body: "Global edge-caching resolves BIN metadata in under 100 milliseconds from any region, eliminating checkout friction and reducing cart abandonment.",
          },
          {
            icon: Database,
            color: "violet",
            title: "600K+ BIN Ranges",
            body: "Daily-refreshed coverage across Visa, Mastercard, Amex, Discover, UnionPay, JCB, and an expanding catalogue of neobank and virtual-card issuers.",
          },
          {
            icon: Lock,
            color: "emerald",
            title: "Zero PII Policy",
            body: "We process only public BIN prefixes — no card numbers, CVVs, or cardholder data — placing our API completely outside PCI-DSS CDE scope.",
          },
        ].map(({ icon: Icon, color, title, body }) => {
          const palette = {
            blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
            violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/40",
            emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40",
          };
          return (
            <div
              key={title}
              className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className={`p-2.5 rounded-xl border shrink-0 ${palette[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Narrative ────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 dark:border-gray-800/60 pt-10">
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            CC Bins vs {competitorName}: Full Analysis
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Performance benchmarks, data coverage, compliance posture, and total cost of ownership — examined in depth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Long-form text — takes 2 cols */}
          <div className="lg:col-span-2 space-y-5 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {paragraphs.map((p, i) => {
              if (p.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3 first:mt-0 leading-tight"
                  >
                    {p.replace("### ", "")}
                  </h3>
                );
              }
              return <p key={i}>{p}</p>;
            })}
          </div>

          {/* Sticky sidebar — score card */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm space-y-5">
              <div className="text-center pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{overallRating}</div>
                <div className="flex justify-center gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(overallRating) ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-700"}`} />
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">CC Bins Overall Score</div>
              </div>

              <div className="space-y-4">
                <ScoreBar label="Performance" score={performanceScore} color="indigo" />
                <ScoreBar label="Data Coverage" score={coverageScore} color="emerald" />
                <ScoreBar label="Compliance" score={complianceScore} color="violet" />
                <ScoreBar label="Value for Money" score={valueScore} color="amber" />
              </div>

              <Link
                href="/"
                className="block w-full text-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all"
              >
                Try CC Bins Free →
              </Link>
            </div>

            {/* Competitor summary box */}
            {competitorSummary && (
              <div className="p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> About {competitorName}
                </div>
                {competitorSummary}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Feature comparison table ─────────────────────────────────────── */}
      <div id="comparison-table" className="scroll-mt-24 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Feature Comparison Table
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Detailed side-by-side breakdown of specifications, routing details, and developer tooling.
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 py-4 text-xs font-bold uppercase tracking-wider">
            <div className="text-gray-500 dark:text-gray-400">Capability</div>
            <div className="text-indigo-600 dark:text-indigo-400">CC Bins</div>
            <div className="text-gray-500 dark:text-gray-400">{competitorName}</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800/70">
            {Object.entries(featuresComparison).map(([feature, vals], i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-5 py-4 items-center text-xs sm:text-sm transition-colors duration-150 ${
                  i % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-gray-50/50 dark:bg-gray-900/20"
                }`}
              >
                <div className="font-semibold text-gray-700 dark:text-gray-300">{feature}</div>
                <div className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                  </span>
                  {vals?.ccBins ?? "✓"}
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-rose-500" />
                  </span>
                  {vals?.competitor ?? "Limited"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pros / Cons ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CC Bins pros */}
        <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/40 to-white dark:from-emerald-950/10 dark:to-transparent space-y-5">
          <h3 className="font-extrabold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 text-base">
            <Award className="w-5 h-5 text-emerald-500" />
            Why Developers Choose CC Bins
          </h3>
          <ul className="space-y-3">
            {[
              "Edge-cached responses under 100ms from any global region",
              "600,000 + active BIN ranges updated daily from canonical network feeds",
              "Zero PII design — completely outside PCI-DSS CDE scope",
              "Flat-rate, transparent pricing with no per-call overages",
              "OpenAPI 3.1 docs + SDKs for Node, Python, PHP, and Go",
              "Offline SQLite database files for air-gapped compliance environments",
              "99.99% uptime SLA backed by a global edge network",
              ...uniqueSellingPoints,
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Competitor cons */}
        <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/30 bg-gradient-to-br from-rose-50/40 to-white dark:from-rose-950/10 dark:to-transparent space-y-5">
          <h3 className="font-extrabold text-rose-800 dark:text-rose-400 flex items-center gap-2 text-base">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Known Limitations of {competitorName}
          </h3>
          <ul className="space-y-3">
            {[
              `Higher average latency (${competitorLatency}) compounds under concurrent load`,
              "No published uptime SLA — reliability depends on best-effort infrastructure",
              "Database refresh cycles are slower, risking stale issuer data",
              "Limited SDKs require custom wrapper code for most languages",
              "Pricing tiers can become unpredictable at scale",
              "Compliance documentation is sparse — increases audit overhead",
              "No offline database files for air-gapped or restricted network environments",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Pricing comparison ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CC Bins pricing */}
        <div className="p-6 rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-50/30 to-white dark:from-indigo-950/20 dark:to-transparent shadow-md space-y-4 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-600 text-white">Recommended</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-gray-900 dark:text-white">CC Bins</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Transparent flat-rate pricing</div>
            </div>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {["Free tier — 1,000 lookups/month, no credit card", "Starter — flat monthly rate, unlimited lookups", "Pro — priority SLA + daily CSV exports", "Enterprise — dedicated IPs, custom limits, offline SQLite DB"].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Competitor pricing */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <div className="font-extrabold text-gray-900 dark:text-white">{competitorName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{competitorPricing}</div>
            </div>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            {["Variable per-request metering can cause budget surprises", "Free tier is limited or absent", "Enterprise pricing requires contacting sales", "No offline or CSV export on most plans"].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 dark:border-gray-800/60 pt-10 space-y-7">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-500 shrink-0" />
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Common questions from developers evaluating CC Bins vs {competitorName}.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/30 overflow-hidden"
            >
              <button
                id={`faq-btn-${i}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                aria-expanded={openFaq === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                className={`px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4 ${
                  openFaq === i ? "block" : "hidden"
                }`}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── "Why Switch" mini section ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Cpu, val: "78ms", label: "Avg Response" },
          { icon: Server, val: "600k+", label: "BIN Ranges" },
          { icon: RefreshCw, val: "Daily", label: "DB Updates" },
          { icon: Headphones, val: "24/7", label: "Support (Pro)" },
        ].map(({ icon: Icon, val, label }) => (
          <div key={label} className="text-center p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/30 space-y-2 hover:shadow-md transition-all">
            <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-xl font-extrabold text-gray-900 dark:text-white">{val}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white p-8 sm:p-12 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.3),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.2),transparent_55%)] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-full bg-indigo-500/10 backdrop-blur-md">
            <Users className="w-3.5 h-3.5" /> Trusted by 10,000+ Developers
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
            Switch to a Faster BIN Validation API Today
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
            Stop accepting slow, unreliable BIN lookups. CC Bins delivers
            sub-100ms validation across 600,000+ ranges — free to start, simple
            to scale, and fully compliant.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-indigo-900 font-extrabold text-sm hover:bg-indigo-50 transition-all shadow-xl shadow-black/20 active:scale-[0.98]"
            >
              Try Free BIN Lookup <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/api"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 border border-indigo-500 text-white font-bold text-sm transition-all"
            >
              View API Docs
            </Link>
          </div>
        </div>
      </div>

    </article>
  );
}
