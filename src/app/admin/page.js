"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Force fully reload or navigate to admin dashboard
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center min-h-[500px]">
      <div className="glass-panel p-8 max-w-md w-full relative overflow-hidden shadow-2xl animate-fade-up">
        {/* Soft background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl -z-10" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl -z-10" />

        <div className="flex flex-col items-center gap-3.5 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md select-none">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black text-gray-950 dark:text-white tracking-tight">Admin Gatekeeper</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">CC Bins Management Console</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/5 border border-red-500/20 text-red-650 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Username</label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Password</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gray-950 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-75 disabled:scale-100 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Signing In...
              </>
            ) : (
              'Access Console'
            )}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-gray-150 dark:border-gray-850 text-center flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Demo / First-time Launch</span>
          <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[11px] text-gray-600 dark:text-gray-400 font-semibold flex flex-col gap-1">
            <span>Username: <code className="font-mono text-blue-600 dark:text-blue-400 select-all">admin</code></span>
            <span>Password: <code className="font-mono text-blue-600 dark:text-blue-400 select-all">adminpassword</code></span>
          </div>
        </div>
      </div>
    </div>
  );
}
