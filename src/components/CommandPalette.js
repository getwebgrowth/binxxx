'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CreditCard, Compass, Wrench, X, CornerDownLeft } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close on Escape, navigate on Arrow keys
  useEffect(() => {
    if (!isOpen) return;

    // Focus input when opened
    setTimeout(() => inputRef.current?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[activeIndex]) {
          filteredActions[activeIndex].handler();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, query]);

  // Reset query and active index on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  // Check if query looks like a BIN
  const isBinQuery = /^\d{6,8}$/.test(query.trim());

  // Define static list of navigation links and actions
  const defaultActions = [
    {
      id: 'home',
      title: 'Go to Homepage / BIN Database',
      subtitle: 'Instant BIN lookup search engine',
      icon: <Search className="w-4 h-4" />,
      handler: () => {
        router.push('/');
        onClose();
      }
    },
    {
      id: 'discover',
      title: 'Explore Discover Page',
      subtitle: 'Browse most reviewed BINs and lists',
      icon: <Compass className="w-4 h-4" />,
      handler: () => {
        router.push('/discover');
        onClose();
      }
    },
    {
      id: 'generator',
      title: 'Open Card Generator Tool',
      subtitle: 'Generate test credit cards with Luhn check',
      icon: <CreditCard className="w-4 h-4" />,
      handler: () => {
        router.push('/tools/generator');
        onClose();
      }
    },
    {
      id: 'tools',
      title: 'View All Intelligence Tools',
      subtitle: 'Wrench, Logs, Proxies, and AI tools',
      icon: <Wrench className="w-4 h-4" />,
      handler: () => {
        router.push('/tools');
        onClose();
      }
    }
  ];

  // Dynamic actions based on query
  const dynamicActions = [];
  if (query.trim().length > 0) {
    if (isBinQuery) {
      dynamicActions.push({
        id: 'bin-lookup',
        title: `Search BIN: ${query.trim()}`,
        subtitle: `Go directly to verification page for BIN ${query.trim()}`,
        icon: <CreditCard className="w-4 h-4 text-blue-500" />,
        handler: () => {
          router.push(`/bin/${query.trim()}`);
          onClose();
        }
      });
    } else {
      dynamicActions.push({
        id: 'bin-search-trigger',
        title: `Verify Card Number Prefix "${query.trim()}"`,
        subtitle: 'Prefix search requires 6 to 8 digit BIN number',
        icon: <Search className="w-4 h-4 text-amber-500" />,
        handler: () => {
          // If they entered some numbers but not enough, direct them to home search
          router.push(`/?search=${encodeURIComponent(query.trim())}`);
          onClose();
        }
      });
    }
  }

  // Filter actions based on text query
  const filteredActions = [
    ...dynamicActions,
    ...defaultActions.filter(action => 
      action.title.toLowerCase().includes(query.toLowerCase()) || 
      action.subtitle.toLowerCase().includes(query.toLowerCase())
    )
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        ref={containerRef}
        className="w-full max-w-xl bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[50vh] transition-all animate-scale-up"
      >
        {/* Search header box */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/50">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a 6-digit BIN (e.g. 457173) or search pages..."
            className="w-full bg-transparent border-none text-sm text-gray-850 dark:text-gray-150 placeholder-gray-400 focus:outline-none focus:ring-0"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-850 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Navigation list */}
        <div className="flex-grow overflow-y-auto py-2 custom-scrollbar">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-gray-500">
              No matching pages or action shortcuts found.
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={action.id}
                  onClick={action.handler}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/80 dark:bg-blue-950/20 border-l-4 border-blue-500 pl-3' 
                      : 'border-l-4 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'
                    }`}>
                      {action.icon}
                    </div>
                    <div className="min-w-0">
                      <span className={`block text-xs font-bold ${
                        isSelected 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {action.title}
                      </span>
                      <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate mt-0.5">
                        {action.subtitle}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-750">
                      <span>Enter</span>
                      <CornerDownLeft className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-950/30 flex items-center justify-between text-[9px] font-bold text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="px-1 py-0.5 bg-gray-100 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-750">↑↓</span> Move
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1 py-0.5 bg-gray-100 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-750">Enter</span> Select
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1 py-0.5 bg-gray-100 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-750">Esc</span> Close
            </span>
          </div>
          <div>
            <span>Press <kbd className="font-mono px-1 py-0.5 bg-gray-100 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-750">⌘K</kbd> to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
