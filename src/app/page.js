"use client";

import { useState } from "react";
import { Search, X, ChevronDown, CheckCircle2, Zap, Settings, Check } from "lucide-react";
import SearchableDropdown from "@/components/SearchableDropdown";
import { brands, levels, banks, countries } from "@/lib/filterData";

export default function Home() {
  const [binInput, setBinInput] = useState("");
  const [filters, setFilters] = useState({ vendor: "", bank: "", level: [], country: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pageSize, setPageSize] = useState(100);
  const [layoutMode, setLayoutMode] = useState("windowed"); // "windowed" or "extended"

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


  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="mb-8 text-center sm:text-left animate-fade-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          Deep BIN Intelligence
          <span className="inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
            <Zap className="w-3 h-3 mr-1 fill-blue-600 dark:fill-blue-400" />
            Live Engine
          </span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl font-medium">
          Query millions of records instantly. Use bulk lookup or filter our massive local datasets directly.
        </p>
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
              className="w-full flex-grow min-h-[200px] p-4 text-sm font-sans text-gray-700 dark:text-gray-250 bg-white/50 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white dark:focus:bg-gray-950 transition-all resize-none shadow-inner custom-scrollbar"
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

              <div className="relative">
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
                      <td className="px-5 py-3.5 font-mono font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {r.error ? (
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        {r.bin}
                        {r.error && <span className="block text-[10px] text-red-500 font-sans mt-0.5 opacity-80">{r.error}</span>}
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
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-250">
                            {r.countryCode || r.country.substring(0, 3).toUpperCase()}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-12 text-center text-gray-500 dark:text-gray-450 bg-white/50 dark:bg-gray-950/50">
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
    </div>
  );
}
