"use client";

import { useState } from "react";
import {
  Wrench, FileCode, CreditCard, User, Cpu, Database, Network, Megaphone,
  Clock, X, Sparkles, ArrowRight
} from "lucide-react";
import Link from "next/link";

// Coming Soon modal
function ComingSoonModal({ toolName, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative glass-panel p-8 max-w-sm w-full text-center flex flex-col items-center gap-5 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center">
          <Clock className="w-7 h-7 text-blue-500" />
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">
            Coming Soon
          </span>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {toolName}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            This tool is currently under development. Stay tuned — it will be available soon.
          </p>
        </div>

        {/* Notify CTA */}
        <Link
          href="/contact"
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Get Notified on Launch
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ToolsPageClient() {
  const [modal, setModal] = useState(null); // { name }

  const categories = [
    {
      title: "Cards",
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      items: [
        { name: "Card Generator", link: "/tools/generator", working: true },
        { name: "Have I Been Sold", link: "#", working: false },
        { name: "BIN History Tracker", link: "#", working: false },
      ],
    },
    {
      title: "Logs",
      icon: <FileCode className="w-5 h-5" />,
      color: "text-green-500",
      bg: "bg-green-500/10",
      items: [
        { name: "Log Decryptor", link: "#", working: false },
        { name: "Base Parser", link: "#", working: false },
      ],
    },
    {
      title: "Identity",
      icon: <User className="w-5 h-5" />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      items: [
        { name: "Temp Email", link: "#", working: false },
        { name: "Private Note", link: "#", working: false },
        { name: "Deobfuscate", link: "#", working: false },
      ],
    },
    {
      title: "Proxies",
      icon: <Network className="w-5 h-5" />,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      items: [
        { name: "IP Check", link: "#", working: false },
        { name: "Mass Proxy Checker", link: "#", working: false },
        { name: "Clean Proxy Finder", link: "#", working: false },
      ],
    },
    {
      title: "Data Manipulation",
      icon: <Database className="w-5 h-5" />,
      color: "text-red-500",
      bg: "bg-red-500/10",
      items: [
        { name: "Address Jigger", link: "#", working: false },
        { name: "ZIP Income Lookup", link: "#", working: false },
      ],
    },
    {
      title: "AI",
      icon: <Cpu className="w-5 h-5" />,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      items: [
        { name: "AI Chat", link: "#", working: false },
        { name: "Smart BIN Predictor", link: "#", working: false },
      ],
    },
    {
      title: "Sponsorship",
      icon: <Megaphone className="w-5 h-5" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      items: [
        { name: "Book Ad Slot", link: "/tools/book-ad", working: true },
        { name: "Traffic Metrics", link: "/tools/book-ad", working: true },
      ],
    },
  ];

  return (
    <>
      {modal && (
        <ComingSoonModal toolName={modal.name} onClose={() => setModal(null)} />
      )}

      <div className="w-full flex-grow flex flex-col animate-fade-up">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/30 rounded-full border border-blue-200/40 dark:border-blue-900/30 shadow-sm">
            Intelligence Toolkit
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3 mb-2 flex items-center justify-center gap-3">
            <Wrench className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            Intelligence Tools
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            A growing suite of premium tools for data analysis, generation, and verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="glass-panel p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-850">
                <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                  <span className={cat.color}>{cat.icon}</span>
                </div>
                <h2 className={`text-sm font-bold uppercase tracking-widest ${cat.color}`}>
                  {cat.title}
                </h2>
              </div>

              {/* Tool items */}
              <div className="flex flex-col gap-2 flex-grow">
                {cat.items.map((item, j) => {
                  if (item.working) {
                    return (
                      <Link
                        key={j}
                        href={item.link}
                        className="group px-4 py-3 rounded-xl text-xs font-bold transition-all bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-900 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow flex items-center justify-between"
                      >
                        <span>{item.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setModal({ name: item.name })}
                      className="group px-4 py-3 rounded-xl text-xs font-bold transition-all bg-gray-50/50 dark:bg-gray-900/20 border border-dashed border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 hover:border-blue-300/50 dark:hover:border-blue-900/50 hover:text-blue-400 dark:hover:text-blue-500 flex items-center justify-between cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-850 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 group-hover:text-blue-500 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 transition-all">
                        Soon
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
