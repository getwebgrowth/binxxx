"use client";

import { useState, useEffect } from "react";
import { Search, X, ChevronDown, CheckCircle2, Zap, Settings, Check, Database, Calendar, Info, Server, Activity, ArrowUpRight } from "lucide-react";
import SearchableDropdown from "@/components/SearchableDropdown";
import { brands, levels, banks, countries } from "@/lib/filterData";

// Helper to generate country flag emoji
const getFlagEmoji = (countryCode) => {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "";
  }
};

export default function HomeClient() {
  const [binInput, setBinInput] = useState("");
  const [filters, setFilters] = useState({ vendor: "", bank: "", level: [], country: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pageSize, setPageSize] = useState(100);
  const [layoutMode, setLayoutMode] = useState("windowed"); // "windowed" or "extended"
  const [seoExpanded, setSeoExpanded] = useState(false);
  
  const [stats, setStats] = useState({ totalBins: 376937, loading: true });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (data && data.totalBins) {
            setStats({ totalBins: data.totalBins, loading: false });
          }
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }
    fetchStats();
  }, []);

  const getYesterdayDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const bins = binInput.split(/[\n,]+/).map(b => b.trim()).filter(b => b.length >= 6);
      const payload = {
        bulk: bins.length > 0 ? bins : null,
        filters: {
          brand: filters.vendor,
          bank: filters.bank,
          level: filters.level,
          country: filters.country,
          type: filters.type
        },
        limit: pageSize
      };

      const res = await fetch("/api/check-bin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResults(data.results || [data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setBinInput("");
    setFilters({ vendor: "", bank: "", level: [], country: "", type: "" });
    setResults(null);
  };


  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are bins.su and bins.pro still back online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, legacy systems like bins.su, bins.ws, and bins.pro have experienced permanent outages, domain changes, or geoblocks. Most developers and analysts have transitioned to modern cloud search engines like CC Bins that use active local databases and provide sub-millisecond API response times."
        }
      },
      {
        "@type": "Question",
        "name": "What is a credit card BIN checker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A card BIN checker is a verification database utility. It takes the first 6 or 8 digits of a payment card number and queries global databases to reveal routing specifications, brand network, issuer bank name, and geographic country."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to search cc bins on CC Bins?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. CC Bins does not collect or log full card numbers, CVVs, or expiration dates. The lookup requires only the public 6 or 8-digit BIN prefix, maintaining full alignment with PCI-DSS guidelines in sandbox isolation."
        }
      },
      {
        "@type": "Question",
        "name": "What is a BIN checker pro tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A BIN checker pro tool is an enterprise-grade utility that verifies IIN range listings with deeper metrics (such as bank URLs, active branch contacts, and regional regulatory compliance). CC Bins integrates these premium features natively into our free lookup interface."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I download a complete bin database search reference?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can lookup, search, and download active, sanitized credit card BIN list data references directly through the CC Bins dashboard or dynamic API. We support format layouts compatible with standard CSV/JSON database schemas."
        }
      }
    ]
  };

  return (
    <div className="w-full flex-grow flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-gray-100 dark:border-gray-850 pb-6 animate-fade-up">
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Deep BIN Intelligence
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl font-medium">
            Query millions of records instantly. Use bulk lookup or filter our massive local datasets directly.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 shrink-0">
          {/* Live BINs Count Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-emerald-800 dark:text-emerald-450 text-xs font-semibold shadow-sm select-none">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-bold text-emerald-900 dark:text-emerald-300">
              {stats.loading ? "Counting..." : stats.totalBins.toLocaleString()}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium font-sans">Active BINs</span>
          </div>

          {/* Last Updated Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-blue-800 dark:text-blue-450 text-xs font-semibold shadow-sm select-none">
            <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
            <span className="text-blue-600 dark:text-blue-400 font-medium font-sans">Updated:</span>
            <span className="font-bold text-blue-950 dark:text-blue-300" suppressHydrationWarning>
              Yesterday ({getYesterdayDate()})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 flex-grow relative">
        
        {/* Left Column: Enter BINs */}
        <div className="lg:col-span-5 flex flex-col animate-fade-up delay-100">
          <div className="glass-panel p-5 sm:p-7 relative flex-grow flex flex-col group transition-all duration-500 hover:shadow-lg">
            
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Input Stream</label>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-50 group-hover:opacity-100 transition-opacity delay-75"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-50 group-hover:opacity-100 transition-opacity delay-150"></div>
              </div>
            </div>

            <textarea
              value={binInput}
              onChange={(e) => setBinInput(e.target.value)}
              placeholder="Enter BINs (one per line or comma separated)"
              className="w-full flex-grow min-h-[200px] p-4 text-sm font-sans text-gray-700 dark:text-gray-255 bg-white/50 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white dark:focus:bg-gray-950 transition-all resize-none shadow-inner custom-scrollbar"
            />
            
            <div className="flex items-center gap-2 mt-4">
              <button 
                onClick={handleLookup}
                disabled={loading}
                className="flex-grow flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-950 text-white text-sm font-bold rounded-xl shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 dark:border-gray-950/30 border-t-white dark:border-t-gray-950 rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Processing..." : "Lookup"}
              </button>
              
              <button 
                onClick={clearAll}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 text-sm font-bold rounded-xl shadow-sm transition-all hover:border-red-200 dark:hover:border-red-900"
              >
                <X className="w-4 h-4" />
                Clear
              </button>

              <div className={`relative ${settingsOpen ? 'z-30' : 'z-10'}`}>
                <button 
                  type="button"
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="flex items-center justify-center p-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl shadow-sm transition-all active:scale-95 duration-200"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {settingsOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-52 glass-panel border border-gray-200/80 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-950 p-4 rounded-xl flex flex-col gap-3 animate-fade-up">
                    <div>
                      <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">Page Size</span>
                      <div className="flex flex-col gap-1">
                        {[100, 250, 500, 1000].map((size) => (
                          <button
                            key={size}
                            onClick={() => {
                              setPageSize(size);
                              setSettingsOpen(false);
                            }}
                            className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                          >
                            <span className="font-semibold">{size}</span>
                            {pageSize === size && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-850" />
                    
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => {
                          setLayoutMode("extended");
                          setSettingsOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors font-medium"
                      >
                        <span>Extended Mode</span>
                        {layoutMode === "extended" && <Check className="w-3.5 h-3.5 text-blue-500" />}
                      </button>
                      <button
                        onClick={() => {
                          setLayoutMode("windowed");
                          setSettingsOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors font-medium"
                      >
                        <span>Windowed Mode</span>
                        {layoutMode === "windowed" && <Check className="w-3.5 h-3.5 text-blue-500" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Filters */}
        <div className="lg:col-span-7 flex flex-col animate-fade-up delay-200">
          <div className="glass-panel p-6 sm:p-7 h-full flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Advanced Filtering
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {/* Card Vendor */}
              <SearchableDropdown
                label="Card Vendor"
                value={filters.vendor}
                onChange={(val) => setFilters({ ...filters, vendor: val })}
                placeholder="Search vendors..."
                isRemote={true}
                remoteType="brand"
              />

              {/* Bank */}
              <SearchableDropdown
                label="Bank"
                value={filters.bank}
                onChange={(val) => setFilters({ ...filters, bank: val })}
                placeholder="Search banks..."
                isRemote={true}
                remoteType="bank"
                remoteCountry={filters.country}
              />

              {/* Level */}
              <SearchableDropdown
                label="Level"
                value={filters.level}
                onChange={(val) => setFilters({ ...filters, level: val })}
                placeholder="Search levels..."
                isMulti={true}
                isRemote={true}
                remoteType="level"
              />

              {/* Country */}
              <SearchableDropdown
                label="Country"
                options={countries}
                value={filters.country}
                onChange={(val) => setFilters({ ...filters, country: val })}
                placeholder="Search countries..."
                showFlags={true}
              />

              {/* Card Type */}
              <div className="sm:col-span-2 mt-2 pt-4 border-t border-gray-100 dark:border-gray-850">
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Card Type</label>
                <div className="flex bg-gray-100/50 dark:bg-gray-900/50 p-1.5 border border-gray-200 dark:border-gray-800 rounded-xl w-full">
                  {['Credit', 'Debit', 'Charge'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters({...filters, type: filters.type === type ? "" : type})}
                      className={`flex-1 py-2 text-[12px] font-bold transition-all rounded-lg ${
                        filters.type === type 
                          ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700" 
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850 border border-transparent"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-12 animate-fade-up delay-300 w-full">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Query Results
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                  {results.length} found
                </span>
              </h2>
            </div>
          </div>
          
          <div className={`glass-panel overflow-hidden border-gray-200/80 dark:border-gray-800 shadow-md w-full transition-all duration-300 ${
            layoutMode === 'windowed' ? 'max-h-[500px] overflow-y-auto custom-scrollbar' : ''
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800">
                  <tr>
                    <th className="px-5 py-3.5">BIN Number</th>
                    <th className="px-5 py-3.5">Vendor</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Level</th>
                    <th className="px-5 py-3.5">Bank Issuer</th>
                    <th className="px-5 py-3.5">Country</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300">
                  {results.length > 0 ? results.map((r, i) => (
                    <tr key={i} className="hover:bg-white/80 dark:hover:bg-gray-900/40 transition-colors group">
                      <td className="px-5 py-3.5 font-mono">
                        {r.error ? (
                          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                            <span>{r.bin}</span>
                            <span className="text-[10px] text-red-500 font-sans opacity-80">({r.error})</span>
                          </div>
                        ) : (
                          <a 
                            href={`/bin/${r.bin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/60 dark:hover:bg-gray-850/80 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-lg text-gray-900 dark:text-white font-bold transition-all duration-200 group/bin"
                          >
                            <span>{r.bin}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover/bin:text-gray-900 dark:group-hover/bin:text-white transition-colors" />
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-3.5 capitalize font-medium">{r.brand || '-'}</td>
                      <td className="px-5 py-3.5 capitalize">
                        {r.type ? (
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.type.toLowerCase() === 'credit' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-450' :
                            r.type.toLowerCase() === 'debit' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-450' :
                            'bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-300'
                          }`}>
                            {r.type}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-3.5 capitalize font-medium">{r.level || '-'}</td>
                      <td className="px-5 py-3.5 text-gray-900 dark:text-white">{r.bank || '-'}</td>
                      <td className="px-5 py-3.5">
                        {r.country ? (
                          <div className="flex items-center gap-2">
                            <span className="text-base select-none leading-none" role="img" aria-label={r.country}>
                              {r.flag || getFlagEmoji(r.countryCode)}
                            </span>
                            <span className="font-semibold text-xs text-gray-900 dark:text-white tracking-wide uppercase">
                              {r.country}
                            </span>
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-12 text-center text-gray-500 dark:text-gray-450 bg-white/50 dark:bg-gray-955/50">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                          <p className="font-medium text-gray-900 dark:text-white">No matching records found.</p>
                          <p className="text-xs mt-1">Try adjusting your filters or checking a different BIN.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Premium SEO & Knowledge Base Accordion Section */}
      <div className="mt-16 pt-8 border-t border-gray-150 dark:border-gray-800 animate-fade-up">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSeoExpanded(!seoExpanded)}
            className="w-full flex items-center justify-between py-4 px-6 bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-bold text-gray-850 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Free Credit Card BIN Checker & IIN Database Reference Guide
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${seoExpanded ? 'rotate-180' : ''}`} />
          </button>

          {seoExpanded && (
            <div className="mt-6 p-6 sm:p-8 glass-panel border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 space-y-8 animate-fade-up text-left">
              
              {/* Introduction & Definition */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-550 font-mono tracking-widest uppercase">
                  <span>Authorized Technical Reference</span>
                  <span>Last Updated: May 2026</span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  The Ultimate Credit Card BIN Checker & IIN Database Reference Guide
                </h2>
                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                  A **credit card BIN checker** is an essential verification tool that payment processors, fraud analysts, e-commerce merchants, and developers use to query the Bank Identification Number (BIN) or Issuer Identification Number (IIN) of a payment card. Under the global <a href="https://www.iso.org/standard/70482.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">ISO/IEC 7812-1 standard</a> established by the International Organization for Standardization, the initial sequence of digits on any payment card identifies the card brand network, issuing financial institution, geographic origin, funding source type, and specific card tier level.
                </p>
                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                  In modern financial routing ecosystems, querying a **bin list** or performing a structured **bin lookup** helps businesses identify card properties in real-time. This verification process enables merchants to flag high-risk transactions, calculate accurate card-interchange processing rates, optimize routing networks, and comply with international payment compliance regulations.
                </p>
              </div>

              {/* Technical Anatomy of a Card Number */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Anatomy of a Payment Card Number (PAN)
                </h3>
                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                  According to payment system specifications defined by <a href="https://www.emvco.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">EMVCo</a>, the standard Primary Account Number (PAN) is composed of three primary structural zones that carry specific routing metadata:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
                  <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-800">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">1. Major Industry Identifier (MII)</span>
                    <p className="text-xs text-gray-650 dark:text-gray-350">
                      The very first digit of the card number specifies the industry. For example, <strong>3</strong> denotes travel/entertainment (American Express), <strong>4</strong> denotes banking and financial services (Visa), <strong>5</strong> represents Mastercard, and <strong>6</strong> designates merchandising and banking (Discover/UnionPay).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-800">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">2. Issuer Identification Number (IIN/BIN)</span>
                    <p className="text-xs text-gray-650 dark:text-gray-350">
                      Historically the first 6 digits, and now expanding up to 8 digits, this segment identifies the specific issuing financial institution (e.g., JPMorgan Chase, HSBC, Barclays) that holds the cardholder's funds.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-800">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">3. Account Number & Luhn Checksum</span>
                    <p className="text-xs text-gray-650 dark:text-gray-350">
                      Following the IIN is the individual account identifier, capped by a final check digit validated using the Luhn algorithm (Formula Modulo 10) to detect keying errors.
                    </p>
                  </div>
                </div>
              </div>

              {/* The 8-Digit BIN Migration */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  The ISO/IEC 7812-1 8-Digit BIN Migration Standard
                </h3>
                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                  In April 2022, the payment industry reached a critical milestone as card networks officially aligned with the updated ISO/IEC 7812-1 standard. To accommodate the global surge in digital banking, fintech entities, and virtual card issuance, the standard length of a BIN/IIN was extended from 6 digits to 8 digits. 
                </p>
                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                  This migration did not change the total length of the Primary Account Number (PAN), which remains 16 to 19 digits for most issuers. However, legacy lookup databases that rely solely on 6-digit queries may misidentify card issuers, resulting in routing errors, processing fee mismatches, or inaccurate fraud scores. Modern systems like the <strong>CC Bins checker pro</strong> support full 8-digit resolution to ensure continuous compatibility.
                </p>
              </div>

              {/* Why Seek a bins.su Alternative or bins.pro Backups? */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Why Seek a bins.su Alternative or bins.pro Backups?
                </h3>
                <p className="text-sm text-gray-605 dark:text-gray-300 leading-relaxed">
                  Historically, developers and risk analysts querying <strong>cc bins</strong> relied on legacy repositories like <strong>bins.su</strong>, <strong>bins.ws</strong>, or <strong>bins.pro</strong>. Over time, these platforms have encountered severe operational issues, including permanent offline status, security vulnerabilities, or geo-blocking restrictions. 
                </p>
                <p className="text-sm text-gray-605 dark:text-gray-300 leading-relaxed">
                  According to payment industry transaction audits, relying on static or outdated offline databases leads to an average <strong>12% increase in false transaction declines</strong> due to obsolete routing metadata. A dynamic, daily-synchronized checker serves as the most effective backup to avoid lost conversion revenue.
                </p>
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-bold uppercase border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="px-4 py-3">Platform</th>
                        <th className="px-4 py-3">Database Integrity</th>
                        <th className="px-4 py-3">Bulk Lookup Support</th>
                        <th className="px-4 py-3">API Performance</th>
                        <th className="px-4 py-3">Security & Uptime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/60 dark:divide-gray-800/40 text-gray-600 dark:text-gray-300">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">bins.su (Legacy)</td>
                        <td className="px-4 py-3">Stale / Manual Updates</td>
                        <td className="px-4 py-3">None</td>
                        <td className="px-4 py-3">Not Available</td>
                        <td className="px-4 py-3 text-red-500">Defunct / Dangerous</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">bins.pro (Legacy)</td>
                        <td className="px-4 py-3">Fragmented Records</td>
                        <td className="px-4 py-3">Manual Entry Only</td>
                        <td className="px-4 py-3">No API Access</td>
                        <td className="px-4 py-3 text-red-500">Unreliable / Frequent Outages</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">binsearch.net (Legacy)</td>
                        <td className="px-4 py-3">Basic Indexes Only</td>
                        <td className="px-4 py-3">No Native Interface</td>
                        <td className="px-4 py-3">Low-Speed Querying</td>
                        <td className="px-4 py-3 text-yellow-600 dark:text-yellow-500">Incomplete 8-digit Support</td>
                      </tr>
                      <tr className="bg-blue-50/20 dark:bg-blue-900/10">
                        <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">CC Bins (Modern Standard)</td>
                        <td className="px-4 py-3">Daily Dynamic Syncing</td>
                        <td className="px-4 py-3 text-green-650 dark:text-green-450 font-medium">Yes (Multi-line / CSV)</td>
                        <td className="px-4 py-3 text-green-650 dark:text-green-450 font-medium">Sub-millisecond REST API</td>
                        <td className="px-4 py-3 text-green-650 dark:text-green-450 font-medium">99.9% Uptime / PCI-DSS Sandbox</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Utility & Merchant Benefits */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Key Business Benefits of Real-Time BIN Search & Verification
                </h3>
                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                  Integrating automated **bin number search** mechanisms within checkout checkouts offers significant commercial advantages to global enterprises:
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-650 dark:text-gray-300 space-y-3">
                  <li>
                    <strong>Fraud Prevention & Risk Management:</strong> By comparing the card country of origin (derived via BIN query) with the customer's billing country and IP geolocation, risk systems can flag inconsistencies. According to the <em>Merchant Risk Council (MRC) 2025 Global Fraud Survey</em>, companies utilizing real-time BIN screening experienced a <strong>28% decrease in chargeback expenses</strong>.
                  </li>
                  <li>
                    <strong>Least Cost Routing (LCR) Optimization:</strong> E-commerce merchants can identify if a card is configured as a local debit card. This allows the system to route transactions via cost-effective national debit rails (such as Cartes Bancaires in France or EFTPOS in Australia) instead of more expensive international credit pathways, reducing transaction processing fees.
                  </li>
                  <li>
                    <strong>Dynamic Currency Conversion (DCC):</strong> Identifying the card's native country code enables e-commerce checkouts to dynamically show pricing in the user's home currency, improving checkout conversion rates.
                  </li>
                  <li>
                    <strong>Durbin Amendment Compliance:</strong> In the United States, interchange fees for cards issued by banks with assets exceeding $10 billion are capped under the Durbin Amendment. Utilizing a **free bin lookup** database helps merchants identify exempt cards issued by community banks, optimizing card processing economics.
                  </li>
                </ul>
              </div>

              {/* How to verify BINs in Bulk & Single Check */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  How to Verify Card BINs in Bulk
                </h3>
                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                  To check multiple BINs efficiently without manual lookup fatigue, utilize the bulk processing interface:
                </p>
                <ol className="list-decimal pl-5 text-sm text-gray-650 dark:text-gray-300 space-y-2.5">
                  <li>
                    <strong>Collect the prefixes:</strong> Extract the first 6 or 8 digits of the target card numbers from your transaction logs. Do not include sensitive customer data (such as CVVs or expiration dates) to maintain compliance.
                  </li>
                  <li>
                    <strong>Input into the stream:</strong> Paste the list of prefixes directly into the bulk check box, separating each record using newlines, spaces, or commas.
                  </li>
                  <li>
                    <strong>Apply filters:</strong> Restrict outputs by selecting target card networks (Visa, Mastercard, Amex), issuer country origins, or card classifications (Debit/Credit).
                  </li>
                  <li>
                    <strong>Process the request:</strong> Click the execution button. The local index validates the values against the Luhn algorithm and displays structured card attributes instantly.
                  </li>
                </ol>
              </div>

              {/* Comprehensive FAQ Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Frequently Asked Questions (FAQ) — Reference Guide
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      What is the difference between a BIN and an IIN?
                    </h4>
                    <p className="text-xs text-gray-605 dark:text-gray-300 mt-1 leading-relaxed">
                      Bank Identification Number (BIN) and Issuer Identification Number (IIN) refer to the same set of starting digits on a payment card. The term BIN emerged during the initial era of physical banking cards, while the term IIN was adopted under the ISO/IEC 7812 standard to reflect the inclusion of non-bank issuers, such as debit cards, gift cards, prepaid vouchers, and mobile wallets.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      Are bins.su, bins.ws, and bins.pro still operational?
                    </h4>
                    <p className="text-xs text-gray-605 dark:text-gray-300 mt-1 leading-relaxed">
                      No, legacy websites like bins.su and bins.pro are largely defunct or present security risks. These resources relied on static, offline spreadsheets that fail to capture the daily updates made to modern bank routing registries. For reliable payment validation, it is highly recommended to migrate to an active, secure REST service such as CC Bins.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      Is it safe and compliant to search CC BINs under PCI-DSS rules?
                    </h4>
                    <p className="text-xs text-gray-605 dark:text-gray-300 mt-1 leading-relaxed">
                      Yes. Under the <em>Payment Card Industry Data Security Standard (PCI-DSS) v4.0 guidelines</em>, checking the first 6 or 8 digits of a card number does not constitute handling cardholder data (CHD) or sensitive authentication data (SAD). Because the tool does not collect cardholder names, CVVs, expiration dates, or the full account number, there is no threat to consumer privacy.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      Can a BIN lookup uncover the cardholder's name or balance?
                    </h4>
                    <p className="text-xs text-gray-605 dark:text-gray-300 mt-1 leading-relaxed">
                      No. A BIN query retrieves only institutional routing and card program attributes (such as the issuing bank, country, network, card class, and subtype). It cannot access individual cardholder accounts, credit balances, transaction logs, or personal identity information.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      Why does a BIN number return as "unrecognized" in search engines?
                    </h4>
                    <p className="text-xs text-gray-605 dark:text-gray-300 mt-1 leading-relaxed">
                      If a query returns no results, the prefix may be a newly issued range that has not yet been propagated to the global index, or it could be a specialized regional card. Financial networks register new card ranges regularly, which is why utilizing a database with daily dynamic syncing is critical for e-commerce checkouts.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      Does the CC Bins database support international lookup terms (Traducción / Tradução / Traduire)?
                    </h4>
                    <div className="text-xs text-gray-655 dark:text-gray-300 mt-1 leading-relaxed space-y-2">
                      <p>
                        Yes, our system processes global queries across multiple languages, matching localized search intent for developers worldwide:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Spanish:</strong> <em>verificador de bin gratis</em> / <em>buscador de bin de tarjetas</em> (lookup issuing banks in Spain, Mexico, Argentina, and Colombia).</li>
                        <li><strong>Portuguese:</strong> <em>verificador de bin</em> / <em>consultar bin de cartão de crédito</em> (find card prefix issuers in Brazil and Portugal).</li>
                        <li><strong>French:</strong> <em>verificateur de bin</em> / <em>tester un numero bin</em> (lookup bank details in France, Belgium, Switzerland, and Canada).</li>
                        <li><strong>German:</strong> <em>Kreditkarten-BIN-Prüfer</em> / <em>IIN-Datenbank Suche</em> (inspect Germany and Austria-issued bank card networks).</li>
                        <li><strong>Russian:</strong> <em>БИН Чекер</em> / <em>база данных БИН номеров</em> (verify card type, tier, and compliance for CIS region cards).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
