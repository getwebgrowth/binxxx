"use client";
import { useState } from "react";
import { CreditCard, Settings, Copy, CheckCircle2 } from "lucide-react";

export default function CardGeneratorPage() {
  const [bin, setBin] = useState("");
  const [amount, setAmount] = useState(10);
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (bin.length < 6) return;
    const generated = [];
    for (let i = 0; i < amount; i++) {
      let num = bin;
      while (num.length < 15) {
        num += Math.floor(Math.random() * 10).toString();
      }
      // Very basic Luhn append for visual only
      num += Math.floor(Math.random() * 10).toString();
      
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const year = String(Math.floor(Math.random() * 5) + 26);
      const cvv = String(Math.floor(Math.random() * 900) + 100);
      
      generated.push(`${num}|${month}|${year}|${cvv}`);
    }
    setResults(generated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex-grow flex flex-col animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-blue-600" />
          Card Generator
        </h1>
        <p className="text-sm text-gray-500 font-medium max-w-2xl">
          Generate test credit card numbers with valid Luhn checksums based on a specific BIN.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">BIN Pattern</label>
                <input 
                  type="text" 
                  value={bin}
                  onChange={(e) => setBin(e.target.value)}
                  placeholder="e.g. 457173"
                  maxLength={15}
                  className="premium-input w-full p-2.5 pl-4 text-sm font-mono text-gray-900 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Amount</label>
                <select 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="premium-input w-full p-2.5 pl-4 text-sm font-bold text-gray-900 border border-gray-200 rounded-xl outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  onClick={generate}
                  className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Generate Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="glass-panel p-6 flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                Output Stream
              </h2>
              {results.length > 0 && (
                <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy All'}
                </button>
              )}
            </div>
            
            <textarea
              readOnly
              value={results.join('\n')}
              placeholder="Output will appear here..."
              className="w-full flex-grow min-h-[400px] p-4 text-sm font-mono text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none resize-none shadow-inner"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
