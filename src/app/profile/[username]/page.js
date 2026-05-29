"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Globe, List, CreditCard, Calendar, Loader2, AlertCircle,
  ArrowLeft, ChevronRight, User, ExternalLink
} from 'lucide-react';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inject noindex client-side
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetch(`/api/profile/${username}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProfile(d.profile);
          setLists(d.lists);
        } else {
          setError(d.error || 'User not found.');
        }
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-wider">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <div className="glass-panel p-10 max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h1 className="text-xl font-black text-gray-900 dark:text-white mb-2">User Not Found</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const joinYear = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : '—';

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="w-full flex-grow flex flex-col gap-8 animate-fade-up">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      {/* Profile Hero Card */}
      <div className="glass-panel p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start border-gray-150 dark:border-gray-850 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-indigo-500/8 blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-4xl text-white font-black select-none shadow-xl">
            {profile?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <div>
            <h1 className="text-2xl font-mono font-black text-gray-900 dark:text-white tracking-tight">
              {profile?.username}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
              <Calendar className="w-3.5 h-3.5" />
              Member since {joinDate}
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="flex flex-col items-center sm:items-start gap-0.5">
              <span className="text-xl font-black font-mono text-gray-900 dark:text-white">
                {profile?.public_list_count ?? 0}
              </span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Public Lists
              </span>
            </div>
            <div className="w-[1px] h-8 bg-gray-100 dark:bg-gray-850" />
            <div className="flex flex-col items-center sm:items-start gap-0.5">
              <span className="text-xl font-black font-mono text-gray-900 dark:text-white">
                {profile?.public_bin_count ?? 0}
              </span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                BINs Shared
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Public Lists Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <List className="w-4 h-4 text-blue-500" />
            Public Lists
          </h2>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {lists.length} list{lists.length !== 1 ? 's' : ''}
          </span>
        </div>

        {lists.length === 0 ? (
          <div className="glass-panel p-16 text-center flex flex-col items-center gap-3 border-gray-150 dark:border-gray-850">
            <List className="w-10 h-10 text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {profile?.username} hasn't published any lists yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/list/${list.share_token}`}
                className="glass-panel p-5 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-gray-150 dark:border-gray-850 group"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase rounded border border-emerald-500/20">
                      <Globe className="w-2.5 h-2.5" /> Public
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-sm line-clamp-1">
                    {list.name}
                  </h3>
                  {list.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{list.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-850 pt-3.5 mt-4">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    <CreditCard className="w-3 h-3" /> {list.item_count} BINs
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                    View List <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
