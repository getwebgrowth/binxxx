import ToolsPageClient from "@/components/ToolsPageClient";

export const metadata = {
  title: "Card Intelligence & Verification Tools | CC Bins",
  description: "Explore our developer and checkout auditing tools including card generator, temp email, proxy verification, and ad placement options.",
  alternates: {
    canonical: 'https://ccbins.co/tools',
  }
};

export default function ToolsPage() {
  return <ToolsPageClient />;
}
