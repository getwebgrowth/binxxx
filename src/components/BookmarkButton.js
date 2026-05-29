"use client";

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import AuthModals from './AuthModals';

export default function BookmarkButton({ bin }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [session, setSession] = useState(null);
  
  const [authOpen, setAuthOpen] = useState(false);

  const checkStatus = async () => {
    try {
      const resAuth = await fetch('/api/auth');
      const dataAuth = await resAuth.json();
      
      if (resAuth.ok && dataAuth.authenticated) {
        setSession(dataAuth.user);
        
        // Check if BIN is already saved
        const resCheck = await fetch('/api/user/saved-bins');
        const dataCheck = await resCheck.json();
        if (dataCheck.success) {
          const exists = dataCheck.bins.some(b => b.bin === bin);
          setIsSaved(exists);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [bin]);

  const handleToggle = async () => {
    if (!session) {
      setAuthOpen(true);
      return;
    }

    setToggling(true);
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const res = await fetch('/api/user/saved-bins', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSaved(!isSaved);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="h-8 w-24 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-xl" />
    );
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={toggling}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 border ${
          isSaved
            ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15'
            : 'bg-white dark:bg-gray-950 border-gray-250 dark:border-gray-800 text-gray-700 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
        }`}
      >
        {toggling ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isSaved ? (
          <Bookmark className="w-3.5 h-3.5 fill-blue-500 text-blue-500 dark:text-blue-400" />
        ) : (
          <Bookmark className="w-3.5 h-3.5" />
        )}
        {isSaved ? 'Saved' : 'Save BIN'}
      </button>

      <AuthModals
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView="login"
        onAuthSuccess={(user) => {
          setSession(user);
          checkStatus();
        }}
      />
    </>
  );
}
