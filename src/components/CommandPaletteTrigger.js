'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CommandPalette from './CommandPalette';

export default function CommandPaletteTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100/80 dark:bg-gray-900/85 border border-gray-200/60 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white transition-all shadow-inner active:scale-95 duration-200"
        title="Toggle Search Modal (⌘K)"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="font-mono text-[10px] font-bold tracking-widest opacity-70">⌘K</span>
      </button>

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
