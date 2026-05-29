'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Send, 
  Code2, 
  ShieldAlert, 
  Cpu, 
  Globe2, 
  Info,
  KeyRound,
  ArrowRight,
  Database,
  CheckCircle2,
  FileText,
  BadgeAlert,
  ArrowUpRight,
  Zap,
  Download,
  ChevronDown,
  BookOpen,
  ListChecks
} from 'lucide-react';

const CODE_TEMPLATES = {
  curl: (bin) => `curl -X GET "https://ccbins.co/api/v1/bin/${bin}" \\
  -H "Accept: application/json"`,
  javascript: (bin) => `// Query CC Bins Card API
fetch("https://ccbins.co/api/v1/bin/${bin}")
  .then(res => {
    if (res.status === 429) {
      throw new Error("Rate limit exceeded…");
    }
    return res.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error("API Error:", err));`,
  python: (bin) => `# Python requests integration
import requests

url = "https://ccbins.co/api/v1/bin/${bin}"
response = requests.get(url)

if response.status_code == 200:
    card_data = response.json()
    print(card_data)
elif response.status_code == 429:
    print("Rate limit reached. Please back off…")`,
  go: (bin) => `package main

import (
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\turl := "https://ccbins.co/api/v1/bin/${bin}"
\tresp, err := http.Get(url)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()
\t
\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(body))
}`
};

const FAQS = [
  {
    q: "What is a BIN checker API?",
    a: "A BIN checker API (Bank Identification Number API) is a REST service that accepts the first 6–8 digits of a credit or debit card and returns metadata: the issuing bank, card brand (Visa, Mastercard, Amex), card type (credit, debit, prepaid), card level, and country of issuance. Used for payment routing, fraud detection, and checkout validation."
  },
  {
    q: "Is the CC Bins API free to use?",
    a: "Yes. No API key is required. The public endpoint allows up to 10 requests per minute per IP. For higher volume, the complete offline database (376k+ rows, CSV/SQL) is available for $149 one-time."
  },
  {
    q: "How do I make my first BIN lookup API call?",
    a: "Send a GET request to https://ccbins.co/api/v1/bin/{bin} where {bin} is a 6–8 digit card prefix. No authentication headers needed. The API returns JSON with fields: success, bin, scheme, type, brand, bank (name, phone, url), and country (name, code, flag)."
  },
  {
    q: "What are the BIN API rate limits?",
    a: "Free tier: 10 requests per minute per IP. Exceeding this returns HTTP 429 Too Many Requests. Response headers include X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset for programmatic backoff."
  },
  {
    q: "Can I use this BIN API in my browser or only server-side?",
    a: "Both. The API is CORS-enabled, so you can call it directly from browser JavaScript (fetch/axios). For server-side, use any HTTP library in Python (requests), Node.js (fetch/axios), Go (net/http), PHP (cURL), or any language with HTTP support."
  }
];

export default function ApiDocsClient() {
  const [testBin, setTestBin] = useState('453271');
  const [activeTab, setActiveTab] = useState('curl');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [httpStatus, setHttpStatus] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Trigger test request on load
  useEffect(() => {
    handleTestRequest();
  }, []);

  const handleTestRequest = async () => {
    if (!testBin || !/^\d{6,8}$/.test(testBin)) return;
    setLoading(true);
    setApiResponse(null);
    setHttpStatus(null);

    try {
      const res = await fetch(`/api/v1/bin/${testBin}`);
      setHttpStatus(res.status);
      
      const limit = res.headers.get('X-RateLimit-Limit');
      const remaining = res.headers.get('X-RateLimit-Remaining');
      const reset = res.headers.get('X-RateLimit-Reset');
      
      if (limit) {
        setRateLimitInfo({ limit, remaining, reset });
      }

      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setApiResponse(JSON.stringify({ error: "Failed to connect to endpoint" }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    const code = CODE_TEMPLATES[activeTab](testBin);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Colored syntax-highlighter for JSON response
  const renderHighlightedJson = (jsonStr) => {
    if (!jsonStr) return null;
    return (
      <code className="block select-text font-mono text-[11px] leading-relaxed">
        {jsonStr.split('\n').map((line, idx) => {
          // Detect key-value patterns
          const match = line.match(/^(\s*)"([^"]+)"\s*:\s*(.*)$/);
          if (match) {
            const indent = match[1];
            const key = match[2];
            const val = match[3];

            let valSpan = <span className="text-gray-300">{val}</span>;
            if (val.trim().startsWith('"')) {
              valSpan = <span className="text-emerald-400">{val}</span>;
            } else if (val.trim().startsWith('true') || val.trim().startsWith('false')) {
              valSpan = <span className="text-blue-400 font-bold">{val}</span>;
            } else if (val.trim().match(/^\d+/)) {
              valSpan = <span className="text-amber-400">{val}</span>;
            } else if (val.trim().startsWith('{') || val.trim().startsWith('[')) {
              valSpan = <span className="text-gray-400">{val}</span>;
            }

            return (
              <div key={idx} className="whitespace-pre">
                {indent}
                <span className="text-purple-400 font-bold">"{key}"</span>: {valSpan}
              </div>
            );
          }
          return <div key={idx} className="whitespace-pre text-gray-500">{line}</div>;
        })}
      </code>
    );
  };

  // Colored syntax-highlighter for code snippets
  const renderHighlightedCode = (lang, bin) => {
    const code = CODE_TEMPLATES[lang](bin);
    return (
      <code className="block select-text font-mono text-[11px] leading-relaxed text-left">
        {code.split('\n').map((line, idx) => {
          let lineContent = line;

          if (lang === 'curl') {
            // Highlight cURL properties
            if (line.trim().startsWith('curl')) {
              return (
                <div key={idx} className="whitespace-pre">
                  <span className="text-blue-400 font-bold">curl</span>
                  {line.substring(4)}
                </div>
              );
            }
            if (line.includes('Accept:')) {
              return (
                <div key={idx} className="whitespace-pre text-gray-400">
                  {line.split('"')[0]}"
                  <span className="text-emerald-400">Accept: application/json</span>"
                </div>
              );
            }
          }

          if (lang === 'javascript') {
            if (line.trim().startsWith('//')) {
              return <div key={idx} className="whitespace-pre text-gray-500 italic">{line}</div>;
            }
            if (line.includes('fetch') || line.includes('then') || line.includes('catch')) {
              const parts = line.split(/(fetch|then|catch)/);
              return (
                <div key={idx} className="whitespace-pre">
                  {parts.map((p, pIdx) => {
                    if (p === 'fetch' || p === 'then' || p === 'catch') {
                      return <span key={pIdx} className="text-purple-400 font-bold">{p}</span>;
                    }
                    if (p.includes('"')) {
                      const quoteParts = p.split('"');
                      return (
                        <span key={pIdx}>
                          {quoteParts[0]}
                          <span className="text-emerald-400">"{quoteParts[1]}"</span>
                          {quoteParts[2]}
                        </span>
                      );
                    }
                    return p;
                  })}
                </div>
              );
            }
          }

          if (lang === 'python') {
            if (line.trim().startsWith('#')) {
              return <div key={idx} className="whitespace-pre text-gray-500 italic">{line}</div>;
            }
            if (line.startsWith('import ') || line.startsWith('if ') || line.startsWith('elif ')) {
              const kw = line.startsWith('import ') ? 'import ' : line.startsWith('if ') ? 'if ' : 'elif ';
              return (
                <div key={idx} className="whitespace-pre">
                  <span className="text-blue-400 font-bold">{kw}</span>
                  {line.substring(kw.length)}
                </div>
              );
            }
          }

          if (lang === 'go') {
            if (line.startsWith('package ') || line.startsWith('import ') || line.startsWith('func ')) {
              const kw = line.startsWith('package ') ? 'package ' : line.startsWith('import ') ? 'import ' : 'func ';
              return (
                <div key={idx} className="whitespace-pre">
                  <span className="text-blue-400 font-bold">{kw}</span>
                  {line.substring(kw.length)}
                </div>
              );
            }
            if (line.includes('nil') || line.includes('err') || line.includes('panic')) {
              return (
                <div key={idx} className="whitespace-pre text-gray-300">
                  {line.replace('nil', 'nil').replace('err', 'err')}
                </div>
              );
            }
          }

          return <div key={idx} className="whitespace-pre text-gray-300">{lineContent}</div>;
        })}
      </code>
    );
  };

  return (
    <div className="space-y-16 animate-fade-up max-w-5xl mx-auto w-full">
      {/* ── Hero Banner ────────────────────────────────────────────── */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/20 uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
          Developer API Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight text-wrap-balance">
          Free Credit Card BIN Checker API
        </h1>
        <p className="text-sm sm:text-base text-gray-550 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Query any 6–8 digit BIN prefix and instantly get the card brand, type, issuing bank, and country — no API key required. Used by checkout engineers, fraud analysts, and payment routing systems.
        </p>
        {/* Use-case chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {['Checkout Validation', 'Fraud Detection', 'Payment Routing', 'Risk Scoring', 'BIN Enrichment'].map(tag => (
            <span key={tag} className="px-2.5 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-800">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Sandbox Console & Code Blocks (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="glass-panel p-6 border border-gray-250/50 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 flex-grow flex flex-col justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-500" aria-hidden="true" />
                  API Playground & Request Tester
                </h2>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-550 font-mono">
                  <span>GET</span>
                  <span className="bg-gray-150/60 dark:bg-gray-900 px-1 py-0.5 rounded">/api/v1/bin/[number]</span>
                </div>
              </div>
              
              <div className="flex gap-2 max-w-sm mb-6">
                <div className="relative flex-grow">
                  <label htmlFor="bin-input" className="sr-only">Enter BIN prefix to query</label>
                  <input
                    id="bin-input"
                    type="text"
                    maxLength={8}
                    value={testBin}
                    onChange={(e) => setTestBin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-8 digit BIN…"
                    className="w-full px-4 py-2.5 text-sm font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleTestRequest}
                  disabled={loading || testBin.length < 6}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all shrink-0"
                >
                  {loading ? 'Sending…' : (
                    <>
                      Send Request
                      <Send className="w-3 h-3" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated Terminal Window */}
            <div className="w-full bg-gray-950 dark:bg-black border border-gray-850 dark:border-gray-900 rounded-2xl p-4 font-mono text-xs flex-grow flex flex-col justify-between overflow-hidden shadow-inner min-h-[300px]">
              <div>
                <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-gray-600 dark:text-gray-500 font-bold uppercase tracking-wider font-sans">JSON Response Console</span>
                </div>

                <div className="text-gray-400 space-y-1">
                  <div>
                    <span className="text-blue-405 font-bold">Request Endpoint:</span> <span className="text-gray-300 font-mono">https://ccbins.co/api/v1/bin/{testBin}</span>
                  </div>
                  {httpStatus && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-405 font-bold">HTTP Status:</span>
                      <span className={`font-bold font-mono ${httpStatus === 200 ? 'text-green-500' : 'text-rose-500'}`}>
                        {httpStatus} {httpStatus === 200 ? 'OK' : httpStatus === 429 ? 'Too Many Requests' : httpStatus === 404 ? 'Not Found' : 'Error'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Console Output */}
              <div className="flex-grow my-4 overflow-y-auto max-h-[220px] no-scrollbar text-left border-t border-b border-gray-900/60 py-3">
                {loading ? (
                  <span className="text-gray-500 animate-pulse block">Loading API response data…</span>
                ) : apiResponse ? (
                  renderHighlightedJson(apiResponse)
                ) : (
                  <span className="text-gray-650 block">Waiting for request trigger…</span>
                )}
              </div>

              {/* Rate Limit Stats Footer */}
              <div className="pt-2 flex justify-between text-[9px] text-gray-500 font-mono font-variant-numeric: tabular-nums">
                <span>Rate Limits remaining: {rateLimitInfo ? rateLimitInfo.remaining : '10'}/10</span>
                <span>Reset in: {rateLimitInfo ? `${Math.max(0, rateLimitInfo.reset - Math.ceil(Date.now() / 1000))}s` : '60s'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Snippets Console (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="glass-panel p-6 border border-gray-250/50 dark:border-gray-800 bg-white/50 dark:bg-gray-950/40 flex-grow flex flex-col justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-500" aria-hidden="true" />
                  Code Integration Snippet
                </h2>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Copy code snippet to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Snippet Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4 overflow-x-auto no-scrollbar">
                {['curl', 'javascript', 'python', 'go'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-3 py-1.5 text-xs font-bold transition-all border-b-2 capitalize font-mono ${
                      activeTab === lang
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Displaying Code with syntax highlighting */}
            <div className="relative bg-gray-950 dark:bg-black p-4 border border-gray-850 dark:border-gray-900 rounded-2xl font-mono text-[11px] leading-relaxed text-gray-300 text-left flex-grow min-h-[300px] shadow-inner overflow-hidden">
              <pre className="whitespace-pre overflow-x-auto no-scrollbar select-all h-full">
                {renderHighlightedCode(activeTab, testBin)}
              </pre>
            </div>
          </div>
        </div>

      </div>

      {/* Premium BIN Checker Pricing Tiers */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Premium BIN Checker Pricing Tiers
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose the routing intelligence capacity that fits your operation. Free sandbox to offline setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="glass-panel p-6 border border-gray-200 dark:border-gray-850 flex flex-col justify-between h-full bg-white/50 dark:bg-gray-950/20 group hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Free Web lookup</span>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-extrabold text-gray-950 dark:text-white font-mono">$0</span>
                <span className="text-xs text-gray-400">/ forever</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Perfect for payment risk teams performing manual BIN audits.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-650 dark:text-gray-300 border-t border-gray-100 dark:border-gray-900 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  Unlimited Single Lookups
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  Bulk Stream Paste (1k rows)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  Standard Brand/Bank Filters
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <a href="/" className="w-full text-center block px-4 py-2 bg-gray-900 hover:bg-black dark:bg-gray-850 dark:hover:bg-gray-800 text-white rounded-xl font-bold text-xs transition-colors">
                Go to Interface
              </a>
            </div>
          </div>

          {/* Developer Sandbox */}
          <div className="p-6 rounded-[16px] border border-blue-500/30 dark:border-blue-900/40 flex flex-col justify-between h-full bg-gradient-to-br from-blue-50/10 via-transparent to-transparent dark:from-blue-950/5 relative shadow-sm group hover:shadow-md transition-shadow">
            <div className="absolute -top-3 left-6 px-2.5 py-0.5 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
              Developer Sandbox
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-2 mt-1">Free API Beta</span>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-extrabold text-gray-950 dark:text-white font-mono">$0</span>
                <span className="text-xs text-gray-400">/ beta access</span>
              </div>
              <p className="text-xs text-gray-550 dark:text-gray-450 leading-relaxed mb-6">
                Query card properties programmatically inside dynamic checkouts.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-650 dark:text-gray-300 border-t border-gray-150 dark:border-gray-800 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  10 reqs/min rate limit per IP
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  Full JSON Payload structure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  CORS-enabled public access
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => {
                  const el = document.getElementById('bin-input');
                  if (el) el.focus();
                }}
                className="w-full text-center block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
              >
                Try sandbox above
              </button>
            </div>
          </div>

          {/* Premium Database */}
          <div className="glass-panel p-6 border border-gray-250 dark:border-gray-850 flex flex-col justify-between h-full bg-white/50 dark:bg-gray-950/20 group hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest block mb-2">Offline Database download</span>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-extrabold text-gray-950 dark:text-white font-mono">$149</span>
                <span className="text-xs text-gray-400">/ one-time buy</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Host the complete verified dataset locally to bypass routing latency.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-650 dark:text-gray-300 border-t border-gray-100 dark:border-gray-900 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  376,900+ verified rows (CSV/SQL)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  Weekly database updates (12m)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  Zero API latency or query caps
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <a href="mailto:admin@ccbins.co?subject=BIN%20Database%20Purchase%20Request" className="w-full text-center block px-4 py-2 bg-gray-900 hover:bg-black dark:bg-gray-850 dark:hover:bg-gray-800 text-white rounded-xl font-bold text-xs transition-colors">
                Order Download
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BIN Database For Sale (Offline downloads) */}
      <div className="glass-panel p-6 sm:p-8 bg-white/50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-850 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
        <div className="md:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/20 uppercase tracking-wide">
            <Database className="w-3.5 h-3.5" aria-hidden="true" />
            BIN Database For Sale
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Buy BIN Database Download - Complete CSV / SQL List
          </h2>
          <p className="text-xs sm:text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
            Running lookup queries via network APIs can introduce millisecond delays at checkout. For large volume merchants and fraud scoring engines, buying the complete offline database is the industry standard to guarantee sub-millisecond local queries. 
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-2">
            <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">Download File Specifications</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-gray-400 dark:text-gray-550 text-[10px]">RECORDS</span>
                <span className="font-bold text-gray-850 dark:text-gray-200 font-mono">376,938 rows</span>
              </div>
              <div>
                <span className="block text-gray-400 dark:text-gray-550 text-[10px]">FILE FORMATS</span>
                <span className="font-bold text-gray-850 dark:text-gray-200 font-mono">CSV, SQL (MySQL)</span>
              </div>
              <div>
                <span className="block text-gray-400 dark:text-gray-550 text-[10px]">FILE SIZE</span>
                <span className="font-bold text-gray-850 dark:text-gray-200 font-mono">~37.0 MB (Uncompressed)</span>
              </div>
              <div>
                <span className="block text-gray-400 dark:text-gray-550 text-[10px]">COLUMN SCHEMA</span>
                <span className="font-bold text-gray-850 dark:text-gray-200 font-mono text-[10px]">bin, brand, type, bank, country…</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-850/80 text-center flex flex-col justify-center h-full">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ONE-TIME LICENSE</span>
          <div className="my-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white font-mono">$149.00</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-normal mb-4">
            Includes weekly database update notifications delivered via email for 12 months.
          </p>
          <a
            href="mailto:admin@ccbins.co?subject=BIN%20Database%20CSV%20SQL%20Download%20Inquiry"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-black dark:bg-gray-880 dark:hover:bg-gray-750 text-white rounded-xl font-bold text-xs shadow transition-all hover:shadow-md"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Buy Database Download
          </a>
        </div>
      </div>

      {/* Endpoint Details Tables */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" aria-hidden="true" />
          Endpoint Information & Request Parameters
        </h2>
        
        <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
          The public card BIN API endpoint accepts <code>GET</code> queries. We resolve card attributes by inspecting our local indexed database containing 376k+ entries and performing on-the-fly lookups for unrecognized ranges.
        </p>

        {/* Parameter Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-bold uppercase border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Required</th>
                <th className="px-4 py-3">Placement</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60 dark:divide-gray-800/40 text-gray-600 dark:text-gray-300 font-medium">
              <tr>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white font-mono">number</td>
                <td className="px-4 py-3 font-mono">string</td>
                <td className="px-4 py-3 text-red-500">Yes</td>
                <td className="px-4 py-3">URL Path</td>
                <td className="px-4 py-3">The card Bank Identification Number prefix. Must be exactly 6, 7, or 8 numeric digits.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Response Data Fields Table */}
        <h3 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider pt-4">
          JSON Response Property Schema
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-bold uppercase border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60 dark:divide-gray-800/40 text-gray-600 dark:text-gray-300 font-medium leading-relaxed font-variant-numeric: tabular-nums">
              <tr>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-mono">success</td>
                <td className="px-4 py-3 font-mono">boolean</td>
                <td className="px-4 py-3">Indicates if the query completed successfully and the BIN record was resolved.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-mono">bin</td>
                <td className="px-4 py-3 font-mono">string</td>
                <td className="px-4 py-3">The verified card prefix digits queried.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-mono">scheme</td>
                <td className="px-4 py-3 font-mono">string</td>
                <td className="px-4 py-3">Card network network classification (e.g., <code>"visa"</code>, <code>"mastercard"</code>, <code>"amex"</code>, <code>"jcb"</code>).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-mono">type</td>
                <td className="px-4 py-3 font-mono">string</td>
                <td className="px-4 py-3">Card funding type (e.g., <code>"debit"</code>, <code>"credit"</code>, <code>"prepaid"</code>).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-mono">brand</td>
                <td className="px-4 py-3 font-mono">string</td>
                <td className="px-4 py-3">Card tier level (e.g., <code>"CLASSIC"</code>, <code>"PLATINUM"</code>, <code>"BUSINESS"</code>).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-mono">bank</td>
                <td className="px-4 py-3 font-mono">object</td>
                <td className="px-4 py-3">Nested object holding issuing bank <code>name</code>, support <code>phone</code>, and primary <code>url</code>.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-mono">country</td>
                <td className="px-4 py-3 font-mono">object</td>
                <td className="px-4 py-3">Country properties including country <code>name</code>, ISO alpha2 <code>code</code>, and emoji <code>flag</code> character.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Rate Limiting Guidelines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        
        {/* Anti-Scraping Policies */}
        <div className="glass-panel p-6 border-amber-100/50 dark:border-amber-900/30 bg-amber-50/10 dark:bg-amber-950/10 flex gap-4 items-start text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-100/50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Anti-Scraping Protection & Limit Guard</h4>
            <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed">
              To guarantee service stability for all users, the standard public API endpoint rate-limits unauthenticated IPs to exactly <strong>10 requests per minute</strong>. Scraping or bulk crawling queries that trigger recurrent 429 status codes will lead to temporary IP address blocking.
            </p>
          </div>
        </div>

        {/* Global CDN and Edge Routing */}
        <div className="glass-panel p-6 border-blue-100/50 dark:border-blue-900/30 bg-blue-50/10 dark:bg-blue-950/10 flex gap-4 items-start text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
            <Globe2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Global Routing & High Performance</h4>
            <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed">
              Deployed on global edge servers close to your checkout locations. Queries hitting cached SQLite records resolve in under <strong>45ms</strong>, preventing any delay or visual latency during checkout form validation processes.
            </p>
          </div>
        </div>

      </div>

      {/* ── How to Integrate — HowTo structured content ─────────── */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-850 pb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <ListChecks className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">How to Use the BIN Checker API</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">4 steps to integrate BIN lookup in your application</p>
          </div>
        </div>

        <ol className="space-y-4">
          {[
            {
              step: 1,
              title: "Choose your BIN prefix",
              desc: "Extract the first 6, 7, or 8 digits from a card number. Most modern cards use 8-digit BINs (effective 2022 ISO 7812 standard). 6-digit BINs are also fully supported.",
              code: "BIN = card_number[:8]  # e.g. '45327185'"
            },
            {
              step: 2,
              title: "Send a GET request to the endpoint",
              desc: "No authentication header or API key is required. Pass the BIN as a URL path parameter.",
              code: "GET https://ccbins.co/api/v1/bin/45327185"
            },
            {
              step: 3,
              title: "Parse the JSON response",
              desc: "The API returns a structured JSON object. Check the success field first, then extract the card metadata you need.",
              code: `{ "success": true, "bin": "453271", "scheme": "visa", "type": "credit", "brand": "CLASSIC", "bank": { "name": "JP Morgan Chase" }, "country": { "name": "United States", "code": "US", "flag": "🇺🇸" } }`
            },
            {
              step: 4,
              title: "Handle rate limits gracefully",
              desc: "The free tier allows 10 requests/minute per IP. Read X-RateLimit-Remaining from response headers and implement exponential backoff when approaching limits.",
              code: "if (res.status === 429) { await sleep(60000); retry(); }"
            }
          ].map(({ step, title, desc, code }) => (
            <li key={step} className="flex gap-4">
              <div className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center mt-0.5">
                {step}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{desc}</p>
                <code className="block bg-gray-950 text-emerald-400 text-[10px] font-mono px-3 py-2 rounded-lg overflow-x-auto">
                  {code}
                </code>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Developer CTA section */}
      <div className="p-8 text-center space-y-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800 rounded-3xl text-white overflow-hidden relative group shadow-2xl">
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mx-auto shadow-md">
            <KeyRound className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">Need Enterprise Key Capacity?</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            If you are executing bulk card audits or require higher throughput thresholds, contact our infrastructure team. We offer dedicated API key credentials with higher limits.
          </p>
          <div className="pt-2">
            <a 
              href="mailto:admin@ccbins.co?subject=Enterprise%20API%20Access%20Request" 
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              Request Custom Limits
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* ── FAQ Section ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Common questions about integrating and using the CC Bins BIN lookup API.
        </p>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="glass-panel overflow-hidden border border-gray-100 dark:border-gray-850 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-5 text-left"
                aria-expanded={openFaq === i}
              >
                <span className="text-sm font-bold text-gray-900 dark:text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openFaq === i ? 'rotate-180 text-blue-500' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-850 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
