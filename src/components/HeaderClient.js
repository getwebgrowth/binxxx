"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, ShieldCheck, ChevronDown, LogIn, Menu, X } from 'lucide-react';
import CommandPaletteTrigger from './CommandPaletteTrigger';
import ThemeToggle from './ThemeToggle';
import AuthModals from './AuthModals';

export default function HeaderClient() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState('login');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch current session status on mount
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setSession(data.user);
      } else {
        setSession(null);
      }
    } catch (e) {
      setSession(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
      if (res.ok) {
        setSession(null);
        setDropdownOpen(false);
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAuth = (view) => {
    setModalView(view);
    setModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b border-gray-100 dark:border-gray-800 rounded-none border-x-0 border-t-0 shadow-sm backdrop-blur-xl bg-white/70 dark:bg-gray-950/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-white font-mono font-bold text-lg tracking-tighter">CC</span>
            </div>
            <span className="font-mono text-xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-350 transition-colors">
              CC Bins
            </span>
          </Link>
          
          {/* Desktop Nav & Controls */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-[13px] font-semibold text-gray-500 dark:text-gray-400">
              <Link href="/my-bins" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">My Bins</Link>
              <Link href="/discover" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">Discover</Link>
              <Link href="/tools" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">Tools</Link>
              <Link href="/free-bin-checker-api" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">API Docs</Link>
              <Link href="/blog" className="hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white hover:after:w-full after:transition-all after:duration-300">Blog</Link>
            </nav>
            
            <div className="flex items-center gap-4">
              {/* Search Shortcut & Command Palette */}
              <CommandPaletteTrigger />
              {/* Theme Toggle */}
              <ThemeToggle />
              
              <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-800" />

              {/* Dynamic Auth State Controls */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-850 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center text-[10px] text-white font-extrabold select-none uppercase">
                      {session.username.charAt(0)}
                    </div>
                    <span className="max-w-[80px] truncate">{session.username}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-2xl shadow-xl p-2 animate-fade-in flex flex-col gap-1 z-50">
                      <Link
                        href="/my-bins"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-blue-500" />
                        My Bins Panel
                      </Link>
                      
                      {(session.role === 'admin' || session.role === 'editor') && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-500" />
                          Admin Console
                        </Link>
                      )}

                      <div className="h-[1px] bg-gray-100 dark:bg-gray-850 my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuth('login')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-950 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden items-center gap-2">
            <CommandPaletteTrigger />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-850 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl py-4 px-4 flex flex-col gap-3 shadow-lg">
            <nav className="flex flex-col gap-2.5 text-sm font-semibold text-gray-650 dark:text-gray-400">
              <Link href="/my-bins" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-950 dark:hover:text-white py-1">My Bins</Link>
              <Link href="/discover" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-950 dark:hover:text-white py-1">Discover</Link>
              <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-950 dark:hover:text-white py-1">Tools</Link>
              <Link href="/free-bin-checker-api" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-950 dark:hover:text-white py-1">API Docs</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-950 dark:hover:text-white py-1">Blog</Link>
            </nav>

            <div className="h-[1px] bg-gray-100 dark:bg-gray-850 my-1" />

            {session ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 py-1">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center text-xs text-white font-extrabold select-none">
                    {session.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{session.username}</span>
                </div>
                {(session.role === 'admin' || session.role === 'editor') && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 py-1"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 py-1 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="w-full py-2.5 bg-gray-950 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
            )}
          </div>
        )}
      </header>

      {/* Login & Sign Up Overlays */}
      <AuthModals
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialView={modalView}
        onAuthSuccess={(user) => {
          setSession(user);
          router.refresh();
        }}
      />
    </>
  );
}
