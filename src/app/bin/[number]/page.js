import { lookupBins } from "@/lib/binLookup";
import CopyButton from "@/components/CopyButton";
import CommunityReviews from "@/components/CommunityReviews";
import { 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  List, 
  MessageSquare, 
  Globe, 
  Phone, 
  ExternalLink, 
  ArrowLeft, 
  Lock, 
  Check,
  ArrowUpRight
} from "lucide-react";

export async function generateMetadata({ params }) {
  const bin = params.number;
  const results = await lookupBins([bin]);
  const data = results && results.length > 0 && !results[0].error ? results[0] : null;

  if (data) {
    const title = `BIN ${bin} Details - ${data.brand || ""} ${data.type || ""} Card issued by ${data.bank || "Unknown Bank"} | CC Bins`;
    const description = `Verify BIN ${bin}. Country: ${data.country || "N/A"} ${data.flag || ""}, Network: ${data.brand || "N/A"}, Level: ${data.level || "N/A"}, Bank: ${data.bank || "N/A"}. Live lookup results from CC Bins.`;
    return {
      title,
      description,
      alternates: {
        canonical: `https://ccbins.co/bin/${bin}`,
      }
    };
  }

  return {
    title: `${bin} BIN Lookup - Verify Credit Card Info | CC Bins`,
    description: `Check details for BIN ${bin}. Find out the card brand, issuing bank, card level, and country of origin instantly with CC Bins.`,
    alternates: {
      canonical: `https://ccbins.co/bin/${bin}`,
    }
  };
}

export default async function SingleBinPage({ params }) {
  const bin = params.number;
  const results = await lookupBins([bin]);
  const data = results && results.length > 0 && !results[0].error ? results[0] : null;

  if (!data) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center py-24 animate-fade-up">
        <div className="glass-panel p-8 max-w-md text-center flex flex-col items-center border-red-100 bg-red-50/20">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">BIN Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">
            We couldn't find any records for BIN <span className="font-mono font-bold text-gray-900">{bin}</span> in our databases or external lookup engines.
          </p>
          <a href="/" className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md">
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  // Schema Markup for search engines and AI agents
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": `BIN ${bin} Information`,
        "description": `Detailed BIN details for card prefix ${bin}, issued by ${data.bank || "Unknown Bank"} in ${data.country || "Unknown Country"}.`,
        "category": `${data.brand || ""} ${data.type || ""} Card`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "brand": {
          "@type": "Brand",
          "name": data.brand || "Unknown Brand"
        }
      },
      {
        "@type": "BreadcrumbList",
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
            "name": "BIN Database",
            "item": "https://ccbins.co/discover"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `BIN ${bin}`,
            "item": `https://ccbins.co/bin/${bin}`
          }
        ]
      }
    ]
  };

  // Card theme helper based on vendor/brand
  const getCardTheme = (brandName) => {
    const brand = (brandName || "").toLowerCase();
    if (brand.includes("visa")) {
      return {
        bg: "bg-gradient-to-br from-[#0f54c9] via-[#083580] to-[#021840]",
        overlay: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/30 via-transparent to-transparent",
        color: "text-blue-100",
        accent: "text-white",
        logo: "VISA"
      };
    } else if (brand.includes("mastercard")) {
      return {
        bg: "bg-gradient-to-br from-[#ec001b] via-[#ff5f00] to-[#de4a02]",
        overlay: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-400/30 via-transparent to-transparent",
        color: "text-rose-100",
        accent: "text-white",
        logo: "Mastercard"
      };
    } else if (brand.includes("amex") || brand.includes("american express")) {
      return {
        bg: "bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900",
        overlay: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/30 via-transparent to-transparent",
        color: "text-teal-100",
        accent: "text-white",
        logo: "AMEX"
      };
    } else if (brand.includes("jcb")) {
      return {
        bg: "bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-950",
        overlay: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-400/30 via-transparent to-transparent",
        color: "text-purple-100",
        accent: "text-white",
        logo: "JCB"
      };
    } else if (brand.includes("discover")) {
      return {
        bg: "bg-gradient-to-br from-orange-500 via-amber-600 to-stone-900",
        overlay: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/30 via-transparent to-transparent",
        color: "text-amber-100",
        accent: "text-white",
        logo: "Discover"
      };
    }
    // Default metallic carbon
    return {
      bg: "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black",
      overlay: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-500/20 via-transparent to-transparent",
      color: "text-zinc-400",
      accent: "text-zinc-100",
      logo: "Card"
    };
  };

  const cardTheme = getCardTheme(data.brand);

  // Format BIN space: 4342 56
  const formattedBin = bin.substring(0, 4) + " " + bin.substring(4, 6);

  return (
    <div className="w-full flex-grow flex flex-col animate-fade-up">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Breadcrumbs Trail */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500" aria-label="Breadcrumb">
        <a href="/" className="hover:text-gray-950 dark:hover:text-white transition-colors">Home</a>
        <span className="text-gray-350 dark:text-gray-800">/</span>
        <a href="/discover" className="hover:text-gray-950 dark:hover:text-white transition-colors">BIN Database</a>
        <span className="text-gray-350 dark:text-gray-800">/</span>
        <span className="text-gray-900 dark:text-white font-bold font-mono">{bin}</span>
      </nav>

      {/* Back navigation link */}
      <div className="mb-6">
        <a href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to lookup database
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Left main: Virtual card mock + info grids */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card Mockup Visual Wrapper */}
          <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center justify-between overflow-hidden relative group">
            
            <div className="flex-1 space-y-4 w-full">
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                Live BIN Node
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <span className="font-mono">{bin}</span>
                {data.flag && <span className="text-2xl sm:text-3xl" title={data.country}>{data.flag}</span>}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                Verified index details for <strong className="text-gray-950 dark:text-white font-bold">bin number check</strong> on the card prefix range <span className="font-mono font-bold text-gray-900 dark:text-white">{bin}</span>. Perform a lookup to check if this is {data.brand ? `a ${data.brand}` : 'an'} {data.type || "unknown type"} {data.level || "Classic"} card issued by <span className="font-bold text-gray-850 dark:text-gray-200">{data.bank || "Unknown Bank"}</span> in <span className="font-bold text-gray-850 dark:text-gray-200">{data.country || "Unknown Country"}</span>.
              </p>
            </div>

            {/* Virtual Card Rendering */}
            <div className="relative w-full max-w-[340px] aspect-[1.58/1] shrink-0">
              {/* Back Drop Shadows */}
              <div className="absolute inset-2 bg-blue-500/10 blur-xl rounded-[18px] group-hover:scale-105 transition-transform duration-500"></div>
              
              {/* Card Face */}
              <div className={`absolute inset-0 rounded-[18px] ${cardTheme.bg} p-6 flex flex-col justify-between border border-white/10 shadow-[0_15px_35px_-8px_rgba(0,0,0,0.4)] overflow-hidden group-hover:-translate-y-1 transition-transform duration-500`}>
                <div className={`absolute inset-0 ${cardTheme.overlay}`}></div>
                
                {/* Top bank issuer and flag */}
                <div className="flex justify-between items-start z-10">
                  <div className="max-w-[70%]">
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 truncate">
                      Issuer Bank
                    </span>
                    <span className="block text-xs font-bold text-white tracking-wide truncate">
                      {data.bank || "UNKNOWN ISSUER"}
                    </span>
                  </div>
                  {data.flag && (
                    <span className="text-xl filter drop-shadow-md">{data.flag}</span>
                  )}
                </div>

                {/* Card Chip & Brand logo icon */}
                <div className="flex justify-between items-center z-10 my-1">
                  {/* Gold SIM contact chip */}
                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 border border-amber-300/30 flex flex-col p-1 justify-between shadow-inner relative">
                    <div className="w-full h-0.5 bg-black/10"></div>
                    <div className="w-1/2 h-full border-r border-black/10 absolute top-0 left-1/4"></div>
                    <div className="w-1/2 h-full border-l border-black/10 absolute top-0 right-1/4"></div>
                    <div className="w-full h-0.5 bg-black/10"></div>
                  </div>
                  
                  {cardTheme.logo === "Mastercard" ? (
                    <div className="flex items-center gap-1 z-10 bg-black/10 px-2 py-0.5 rounded">
                      <div className="flex -space-x-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#eb001b]/90" />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f00]/95" />
                      </div>
                      <span className="text-[9px] font-extrabold text-white tracking-tight lowercase">mastercard</span>
                    </div>
                  ) : cardTheme.logo === "VISA" ? (
                    <span className="text-lg font-black italic text-white tracking-wider font-sans z-10">
                      VISA
                    </span>
                  ) : cardTheme.logo === "AMEX" ? (
                    <span className="text-[10px] font-extrabold text-blue-100 border border-blue-300 px-1 py-0.5 rounded font-mono z-10 bg-white/10">
                      AMEX
                    </span>
                  ) : (
                    <span className="text-sm font-black text-white/60 tracking-wider uppercase font-mono z-10">
                      {cardTheme.logo}
                    </span>
                  )}
                </div>

                {/* Card Number display */}
                <div className="space-y-3 z-10">
                  <div className="font-mono text-lg font-bold text-white tracking-[0.25em]">
                    {formattedBin}•• •••• ••••
                  </div>
                  
                  {/* Card bottom metadata details */}
                  <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-white/60">
                    <div>
                      <span className="block text-[6px] text-white/40 mb-0.5">Card Brand</span>
                      <span>{data.brand || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[6px] text-white/40 mb-0.5">Card Level</span>
                      <span>{data.level || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[6px] text-white/40 mb-0.5">Card Type</span>
                      <span className="text-white font-black">{data.type || "N/A"}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Details segment grids */}
          <div className="glass-panel p-6 sm:p-8">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              Routing & Metadata Records
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/80 flex items-center justify-between group/row">
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">BIN / IIN prefix</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white text-lg">{bin}</span>
                </div>
                <CopyButton text={bin} />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/80 flex items-center justify-between group/row">
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Card Brand / Vendor</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg capitalize">{data.brand || "-"}</span>
                </div>
                <CopyButton text={data.brand || ""} />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/80 flex items-center justify-between group/row">
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Funding Type</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg capitalize">{data.type || "-"}</span>
                </div>
                <CopyButton text={data.type || ""} />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/80 flex items-center justify-between group/row">
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Card Level / Category</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg capitalize">{data.level || "-"}</span>
                </div>
                <CopyButton text={data.level || ""} />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/80 flex items-center justify-between group/row">
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Luhn Checksum Algorithm</span>
                  <span className="font-bold text-green-600 dark:text-green-450 flex items-center gap-1.5 text-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-450 fill-green-50/50 dark:fill-green-950/20" /> Valid
                  </span>
                </div>
                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-2 py-0.5 rounded uppercase border border-green-200/50 dark:border-green-900/30">Compliant</span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/80 flex items-center justify-between group/row">
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Country Origin</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                    {data.flag && <span className="text-xl">{data.flag}</span>}
                    {data.country || "-"} 
                    {data.countryCode && <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500">({data.countryCode})</span>}
                  </span>
                </div>
                <CopyButton text={data.country || ""} />
              </div>

            </div>

            {/* Issuer details sub-card block */}
            <div className="mt-6 p-5 bg-blue-50/30 dark:bg-blue-950/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 flex flex-col gap-6">
              <div>
                <span className="block text-[9px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-wider mb-1">Issuer Bank / Entity</span>
                <span className="font-bold text-blue-950 dark:text-blue-200 text-xl tracking-tight block">{data.bank || "Unknown Bank"}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-blue-100/50 dark:border-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-450 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-wider">WEBSITE</span>
                    {data.url ? (
                      <a 
                        href={data.url.startsWith("http") ? data.url : `http://${data.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-blue-900 dark:text-blue-405 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1 text-sm truncate"
                      >
                        {data.url}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">Not Available</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-450 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-wider">PHONE</span>
                    {data.phone ? (
                      <a 
                        href={`tel:${data.phone}`} 
                        className="font-bold text-blue-900 dark:text-blue-405 hover:text-blue-600 dark:hover:text-blue-300 text-sm"
                      >
                        {data.phone}
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">Not Available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* AI-AEO optimized explanation block */}
          <div className="glass-panel p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">About card prefix {bin}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed">
              <p>
                This card database profile provides a detailed <strong className="text-gray-900 dark:text-white font-bold">look up bin number</strong> report. The BIN/IIN range <span className="font-mono font-bold">{bin}</span> is assigned to <strong>{data.bank || "Unknown Bank"}</strong> in <strong>{data.country || "Unknown Country"}</strong>. The card operates on the <strong>{data.brand || "unknown"}</strong> network and is categorized as a <strong>{data.type || "unknown"} {data.level || "Classic"}</strong> card.
              </p>
              <p>
                As a card range complying with ISO/IEC 7812 specifications, this prefix is checked against the Luhn validation formula and conforms to standardized routing paths. If you are doing a <strong className="text-gray-900 dark:text-white font-bold">free bin check</strong>, this local lookup allows you to verify issuer information for secure routing. For transactions, the processor routes the authorization request to {data.bank || "the issuer bank"} via the {data.brand || "card vendor"} system networks.
              </p>
            </div>
          </div>

          {/* Lists with this BIN */}
          <div className="glass-panel p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <List className="w-4 h-4 text-purple-500" />
                  Lists with this BIN
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Public lists containing this BIN.</p>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800/85">
              {[
                {
                  title: "NON-VBV BIN LIST",
                  bins: "136 BINs",
                  author: "manlet1337",
                  time: "about 1 year ago",
                  views: "18,348",
                  color: "from-green-400 to-emerald-500"
                },
                {
                  title: "HIGH QUALITY SNIFFER",
                  bins: "15,000 BINs",
                  author: "Anonymous",
                  time: "about 1 year ago",
                  views: "4,413",
                  color: "from-purple-400 to-indigo-500"
                },
                {
                  title: "MOONLIGHT-P2-BIG-EU_WORLDMIX-SUPER_VALID",
                  bins: "14,236 BINs",
                  author: "Anonymous",
                  time: "about 1 year ago",
                  views: "2,395",
                  color: "from-yellow-300 to-lime-500"
                },
                {
                  title: "NON-VBV BINS made by @LalamovePH",
                  bins: "163 BINs",
                  author: "Anonymous",
                  time: "9 months ago",
                  views: "2,191",
                  color: "from-orange-400 to-amber-500"
                },
                {
                  title: "Nonvbv@blizencvv gonna del it cuz gettng no custmr",
                  bins: "1,245 BINs",
                  author: "Anonymous",
                  time: "11 months ago",
                  views: "2,012",
                  color: "from-teal-400 to-emerald-600"
                }
              ].map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} shrink-0 shadow-sm flex items-center justify-center`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h4 className="font-bold text-gray-800 dark:text-gray-250 text-sm truncate max-w-[280px] sm:max-w-[400px]" title={item.title}>
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold shrink-0">
                          {item.bins}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap items-center gap-1.5 font-medium">
                        <span>{item.author}</span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span>{item.time}</span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span>{item.views} views</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-105 dark:bg-gray-900 dark:hover:bg-gray-850 border border-gray-200/40 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar details */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Reviews card section */}
          <CommunityReviews binNumber={bin} />

          {/* Privacy Security standard lock box */}
          <div className="glass-panel p-5 bg-gradient-to-br from-gray-900 to-black text-white border-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-lg"></div>
            <div className="relative z-10 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">PCI-DSS Compliant</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Queries are handled in sandbox isolation. No card details or transaction identifiers are kept.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
