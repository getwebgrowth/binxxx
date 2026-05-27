import { Wrench, FileCode, CreditCard, User, Cpu, Database, Network, Megaphone } from "lucide-react";

export const metadata = {
  title: "Card Intelligence & Verification Tools | CC Bins",
  description: "Explore our developer and checkout auditing tools including card generator, temp email, proxy verification, and ad placement options.",
  alternates: {
    canonical: 'https://ccbins.co/tools',
  }
};

export default function ToolsPage() {
  const categories = [
    {
      title: "Cards",
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-blue-500",
      items: [
        { name: "Card Generator", link: "/tools/generator" },
        { name: "Have I Been Sold", link: "#" },
        { name: "Coming Soon", link: "#", disabled: true }
      ]
    },
    {
      title: "Logs",
      icon: <FileCode className="w-5 h-5" />,
      color: "text-green-500",
      items: [
        { name: "Decryptor", link: "#" },
        { name: "Coming Soon", link: "#", disabled: true }
      ]
    },
    {
      title: "Identity",
      icon: <User className="w-5 h-5" />,
      color: "text-purple-500",
      items: [
        { name: "Temp Email", link: "#" },
        { name: "Private Note", link: "#" },
        { name: "Deobfuscate", link: "#" },
        { name: "Coming Soon", link: "#", disabled: true }
      ]
    },
    {
      title: "Proxies",
      icon: <Network className="w-5 h-5" />,
      color: "text-orange-500",
      items: [
        { name: "IP Check", link: "#" },
        { name: "Mass Proxy Checker", link: "#" },
        { name: "Clean Proxy Finder", link: "#" },
        { name: "Coming Soon", link: "#", disabled: true }
      ]
    },
    {
      title: "Data Manipulation",
      icon: <Database className="w-5 h-5" />,
      color: "text-red-500",
      items: [
        { name: "Address Jigger", link: "#" },
        { name: "ZIP Income", link: "#" },
        { name: "Coming Soon", link: "#", disabled: true }
      ]
    },
    {
      title: "AI",
      icon: <Cpu className="w-5 h-5" />,
      color: "text-indigo-500",
      items: [
        { name: "AI Chat", link: "#" },
        { name: "Coming Soon", link: "#", disabled: true }
      ]
    },
    {
      title: "Sponsorship",
      icon: <Megaphone className="w-5 h-5" />,
      color: "text-rose-500",
      items: [
        { name: "Book Ad Placement", link: "/tools/book-ad" },
        { name: "Traffic Metrics", link: "/tools/book-ad" }
      ]
    }
  ];

  return (
    <div className="w-full flex-grow flex flex-col animate-fade-up">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 flex items-center justify-center gap-3">
          <Wrench className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          Intelligence Tools
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
          A suite of premium tools for data analysis, generation, and verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="glass-panel p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 ${cat.color}`}>
              {cat.icon}
              {cat.title}
            </h2>
            <div className="flex flex-col gap-2 flex-grow">
              {cat.items.map((item, j) => (
                <a 
                  key={j} 
                  href={item.disabled ? undefined : item.link}
                  className={`px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                    item.disabled 
                      ? "bg-gray-50 dark:bg-gray-900/40 text-gray-400 dark:text-gray-600 border border-transparent cursor-not-allowed border-dashed" 
                      : "bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-900 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
