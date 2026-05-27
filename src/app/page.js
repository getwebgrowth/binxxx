import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: "CC Bins - Free Credit Card BIN Lookup & Database Checker",
  description: "CC Bins is a free credit card BIN lookup tool and IIN database search. Verify card prefix details (Visa, Mastercard, Amex) in bulk with daily updates.",
  keywords: "bin lookup, bin list, binlist, free bin lookup, bin checker pro, pro bin checker, bin database, credit card bin checker, credit card bin database, bin check online, look up bin number, verificador de bin, buscador de bin, bin check de tarjeta",
  alternates: {
    canonical: 'https://ccbins.co',
  },
  openGraph: {
    title: "CC Bins - Free Credit Card BIN Lookup & Database Checker",
    description: "Verify card prefix details (Visa, Mastercard, Amex) in bulk with daily updates.",
    type: "website",
    url: "https://ccbins.co",
  }
};

export default function Home() {
  return <HomeClient />;
}
