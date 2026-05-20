'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync with HTML class set by inline blocker script
    const checkDark = document.documentElement.classList.contains('dark');
    setIsDark(checkDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-500 animate-[spin_10s_linear_infinite]" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
}
