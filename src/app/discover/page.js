import DiscoverPageClient from '@/components/DiscoverPageClient';

export const metadata = {
  title: 'Discover Credit Card BIN Lists & Community Reviews | CC Bins',
  description: 'Explore the most searched card BINs, top community reviewers, recent reviews, and public credit card BIN lists on CC Bins database explorer.',
  alternates: { canonical: 'https://ccbins.co/discover' },
  openGraph: {
    title: 'Discover Credit Card BIN Lists & Community Reviews | CC Bins',
    description: 'Explore community BIN reviews and public card lists on CC Bins.',
    type: 'website',
    url: 'https://ccbins.co/discover',
    images: [{ url: 'https://ccbins.co/og-default.png', width: 1200, height: 630, alt: 'CC Bins BIN Database Explorer' }],
  },
  twitter: { card: 'summary_large_image', title: 'Discover BINs & Reviews | CC Bins' },
};

export default function DiscoverPage() {
  return <DiscoverPageClient />;
}
