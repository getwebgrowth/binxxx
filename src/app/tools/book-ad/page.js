import BookAdClient from "@/components/BookAdClient";

export const metadata = {
  title: "Sponsor & Book Ad Placements | CC Bins",
  description: "Secure visual banner and text link sponsorship slots on the CC Bins dashboard to reach developers and fintech payment risk specialists.",
  alternates: {
    canonical: "https://ccbins.co/tools/book-ad"
  }
};

export default function BookAdPage() {
  return <BookAdClient />;
}
