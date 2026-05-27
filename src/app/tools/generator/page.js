import CardGeneratorClient from "@/components/CardGeneratorClient";
import { CreditCard } from "lucide-react";

export const metadata = {
  title: "Credit Card Generator & Luhn Algorithm Checker | CC Bins",
  description: "Generate mock credit card details with matching Luhn checksum outputs for developer payment routing integration sandbox tests.",
  alternates: {
    canonical: "https://ccbins.co/tools/generator"
  }
};

export default function CardGeneratorPage() {
  return (
    <div className="w-full flex-grow flex flex-col animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-500" />
          Card Generator
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
          Generate test credit card numbers with valid Luhn checksums based on a specific BIN.
        </p>
      </div>

      <CardGeneratorClient />
    </div>
  );
}
