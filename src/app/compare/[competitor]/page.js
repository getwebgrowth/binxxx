import fs from "fs";
import path from "path";
import ComparisonTemplate from "@/components/ComparisonTemplate";

const dataPath = path.join(process.cwd(), "src", "data", "competitors.json");
const competitors = JSON.parse(fs.readFileSync(dataPath, "utf8"));

export async function generateStaticParams() {
  return Object.keys(competitors).map((key) => ({ competitor: key }));
}

export async function generateMetadata({ params }) {
  const slug = params.competitor;
  const comp = competitors[slug];
  if (!comp) {
    return {
      title: "BIN Checker Comparison",
      description: "Compare CC Bins with other BIN lookup services.",
    };
  }

  const title = `CC Bins vs ${comp.name} – BIN Lookup Comparison ${new Date().getFullYear()}`;
  const description =
    comp.metaDescription ||
    `Compare CC Bins and ${comp.name} side-by-side. See which BIN lookup API is faster, more accurate, and better priced for your payment infrastructure.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://ccbins.co/compare/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ccbins.co/compare/${slug}`,
      type: "article",
      siteName: "CC Bins",
      images: [
        {
          url: `https://ccbins.co/compare/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `CC Bins vs ${comp.name} Comparison`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://ccbins.co/compare/${slug}/opengraph-image`],
    },
  };
}

export default function ComparePage({ params }) {
  const slug = params.competitor;
  const comp = competitors[slug];

  if (!comp) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Competitor Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          We could not find information for this competitor.
        </p>
      </div>
    );
  }

  // JSON-LD structured data
  const faqSchema = comp.faqs && comp.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: comp.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ccbins.co" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://ccbins.co/compare" },
      {
        "@type": "ListItem",
        position: 3,
        name: `CC Bins vs ${comp.name}`,
        item: `https://ccbins.co/compare/${slug}`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `CC Bins vs ${comp.name} – BIN Lookup Comparison`,
    description:
      comp.metaDescription ||
      `Compare CC Bins and ${comp.name} side-by-side for speed, coverage, compliance, and pricing.`,
    author: {
      "@type": "Organization",
      name: "CC Bins",
      url: "https://ccbins.co",
    },
    publisher: {
      "@type": "Organization",
      name: "CC Bins",
      url: "https://ccbins.co",
    },
    datePublished: "2026-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `CC Bins vs ${comp.name} Key Feature Comparisons`,
    itemListElement: Object.keys(comp.featuresComparison || {}).map((feature, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: feature,
      description: `CC Bins: ${comp.featuresComparison[feature]?.ccBins || "N/A"} vs ${comp.name}: ${comp.featuresComparison[feature]?.competitor || "N/A"}`
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <ComparisonTemplate
        competitorName={comp.name}
        competitorUrl={comp.url}
        uniqueSellingPoints={comp.uniqueSellingPoints || []}
        featuresComparison={comp.featuresComparison || {}}
        narrativeParagraphs={comp.narrativeParagraphs || []}
        competitorLatency={comp.competitorLatency || "210ms"}
        competitorUptime={comp.competitorUptime || "N/A"}
        competitorBins={comp.competitorBins || "~400k"}
        competitorPricing={comp.competitorPricing || "Variable pricing"}
        faqs={comp.faqs || []}
        competitorSummary={comp.competitorSummary || ""}
        overallRating={comp.overallRating || 4.8}
        performanceScore={comp.performanceScore || 95}
        coverageScore={comp.coverageScore || 98}
        complianceScore={comp.complianceScore || 100}
        valueScore={comp.valueScore || 92}
      />
    </>
  );
}
