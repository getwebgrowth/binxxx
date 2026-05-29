// src/app/compare/bincodes/page.js
import ComparisonTemplate from "@/components/ComparisonTemplate";
import competitors from "@/data/competitors.json";

/**
 * Static page for the Bincodes competitor.
 * This demonstrates the comparison layout for a single competitor.
 */
export default function BincodesPage() {
  const competitor = competitors["bincodes"];
  if (!competitor) {
    return <div>Competitor data not found.</div>;
  }
  return (
    <ComparisonTemplate
      competitorName={competitor.name}
      competitorUrl={competitor.url}
      uniqueSellingPoints={competitor.uniqueSellingPoints}
      features={competitor.features}
      pricing={competitor.pricing}
      pros={competitor.pros}
      cons={competitor.cons}
    />
  );
}
