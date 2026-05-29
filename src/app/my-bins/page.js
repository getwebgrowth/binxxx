"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Bookmark, 
  List, 
  FolderPlus, 
  Trash2, 
  Globe, 
  Lock, 
  Plus, 
  User, 
  Loader2, 
  ChevronRight, 
  Search, 
  Share2, 
  ExternalLink,
  PlusCircle,
  Eye,
  X,
  Copy,
  Check,
  Star,
  MessageSquare
} from 'lucide-react';
import AuthModals from '@/components/AuthModals';

export default function MyBinsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bins'); // 'bins', 'lists', 'bookmarks', 'reviews'
  
  // Auth modal triggers
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  // Dashboard Data
  const [savedBins, setSavedBins] = useState([]);
  const [binLists, setBinLists] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // List Modal
  const [listModalOpen, setListModalOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [listPrivate, setListPrivate] = useState(true);
  const [creatingList, setCreatingList] = useState(false);

  // Share copy state
  const [copiedListId, setCopiedListId] = useState(null);

  // Check auth session
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setSession(data.user);
        fetchDashboardData();
      } else {
        setSession(null);
      }
    } catch (e) {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setDataLoading(true);
    try {
      // Saved Bins
      const resBins = await fetch('/api/user/saved-bins');
      const dataBins = await resBins.json();
      if (dataBins.success) setSavedBins(dataBins.bins);

      // Lists
      const resLists = await fetch('/api/user/lists');
      const dataLists = await resLists.json();
      if (dataLists.success) setBinLists(dataLists.lists);

      // Bookmarks
      const resBookmarks = await fetch('/api/user/bookmarks');
      const dataBookmarks = await resBookmarks.json();
      if (dataBookmarks.success) setBookmarks(dataBookmarks.bookmarks);

      // My Reviews
      const resReviews = await fetch('/api/user/reviews');
      const dataReviews = await resReviews.json();
      if (dataReviews.success) setMyReviews(dataReviews.reviews);
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!listName) return;
    setCreatingList(true);
    try {
      const res = await fetch('/api/user/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: listName,
          description: listDesc,
          isPrivate: listPrivate
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setListModalOpen(false);
        setListName('');
        setListDesc('');
        setListPrivate(true);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingList(false);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm("Are you sure you want to delete this list?")) return;
    try {
      const res = await fetch('/api/user/lists', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteList', listId })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareList = async (list) => {
    // If already has share_token in state, just copy the link
    if (list.share_token) {
      copyListLink(list.id, list.share_token);
      return;
    }
    // Otherwise ask server to create one (by toggling to public if needed)
    // We'll just fetch the updated lists after
    const res = await fetch(`/api/profile/${session?.username}`);
    const data = await res.json();
    const updated = data.lists?.find(l => l.id === list.id);
    if (updated?.share_token) {
      copyListLink(list.id, updated.share_token);
      setBinLists(prev => prev.map(l => l.id === list.id ? { ...l, share_token: updated.share_token } : l));
    }
  };

  const copyListLink = (listId, token) => {
    const url = `${window.location.origin}/list/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedListId(listId);
    setTimeout(() => setCopiedListId(null), 2000);
  };

  const handleRemoveSavedBin = async (bin) => {
    try {
      const res = await fetch('/api/user/saved-bins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bin })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveBookmark = async (listId) => {
    try {
      const res = await fetch('/api/user/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-wider">Loading profile...</span>
      </div>
    );
  }

  // Not Logged In View: Renders inline portal matching binx.vip modal style
  if (!session) {
    return (
      <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[500px]">
        <div className="glass-panel p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl animate-fade-up">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl -z-10" />
          <Bookmark className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-bounce" />
          
          <h1 className="text-2xl font-mono font-black text-gray-950 dark:text-white mb-2">My BINs Console</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold max-w-sm mx-auto mb-6">
            Log in to save BIN ranges, customize lists, and organize BIN intelligence collections.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setAuthView('login'); setAuthOpen(true); }}
              className="flex-1 py-3 px-4 bg-gray-950 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthView('signup'); setAuthOpen(true); }}
              className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-850 border border-gray-250 dark:border-gray-800 text-gray-850 dark:text-gray-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95"
            >
              Create Account
            </button>
          </div>
        </div>

        <AuthModals
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          initialView={authView}
          onAuthSuccess={(user) => {
            setSession(user);
            fetchDashboardData();
            router.refresh();
          }}
        />
      </div>
    );
  }

  // Logged In Dashboard
  return (
    <div className="w-full flex-grow flex flex-col gap-6 animate-fade-up">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 dark:border-gray-850">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase rounded-lg border border-blue-200/50 dark:border-blue-900/30">
            Cardholder Intelligence
          </span>
          <h1 className="text-2xl font-mono font-black text-gray-900 dark:text-white tracking-tight mt-2 flex items-center gap-2">
            My Bins Panel
          </h1>
        </div>

        {activeTab === 'lists' && (
          <button
            onClick={() => setListModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            Create List
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-150 dark:border-gray-850 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('bins')}
          className={`flex items-center gap-1.5 px-5 py-3 border-b-2 transition-all ${
            activeTab === 'bins'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Bins
          <span className="ml-1 px-1.5 py-0.2 bg-gray-100 dark:bg-gray-900 text-[9px] font-mono text-gray-500 rounded">
            {savedBins.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('lists')}
          className={`flex items-center gap-1.5 px-5 py-3 border-b-2 transition-all ${
            activeTab === 'lists'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <List className="w-4 h-4" />
          Lists
          <span className="ml-1 px-1.5 py-0.2 bg-gray-100 dark:bg-gray-900 text-[9px] font-mono text-gray-500 rounded">
            {binLists.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-1.5 px-5 py-3 border-b-2 transition-all ${
            activeTab === 'bookmarks'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          Bookmarks
          <span className="ml-1 px-1.5 py-0.2 bg-gray-100 dark:bg-gray-900 text-[9px] font-mono text-gray-500 rounded">
            {bookmarks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 px-5 py-3 border-b-2 transition-all ${
            activeTab === 'reviews'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          Reviews
          <span className="ml-1 px-1.5 py-0.2 bg-gray-100 dark:bg-gray-900 text-[9px] font-mono text-gray-500 rounded">
            {myReviews.length}
          </span>
        </button>
      </div>

      {/* Dynamic Tab Body */}
      {dataLoading ? (
        <div className="w-full flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="w-full">
          {/* TABS 1: Bins */}
          {activeTab === 'bins' && (
            savedBins.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBins.map((item) => (
                  <div key={item.bin} className="glass-panel p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group border-gray-150 dark:border-gray-850">
                    <button
                      onClick={() => handleRemoveSavedBin(item.bin)}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-black tracking-widest text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-0.5 rounded-lg">
                          {item.bin}
                        </span>
                        {item.flag && <span className="text-sm">{item.flag}</span>}
                      </div>

                      <h3 className="font-extrabold text-gray-950 dark:text-white text-sm mt-1 truncate">
                        {item.bank || 'Unknown Bank'}
                      </h3>

                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1 select-none uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                        <span>{item.brand || 'CARD'}</span>
                        <span>•</span>
                        <span>{item.type || 'DEBIT'}</span>
                        {item.level && (
                          <>
                            <span>•</span>
                            <span>{item.level}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-850 pt-3.5 mt-4">
                      <span className="text-[9px] text-gray-450 dark:text-gray-500 font-mono">
                        Saved: {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/bin/${item.bin}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Inspect BIN
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-16 text-center flex flex-col items-center justify-center gap-3">
                <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-700 animate-pulse" />
                <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">No saved bins yet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-450 max-w-sm">
                  Save BINs from the BIN detail page to see them here.
                </p>
              </div>
            )
          )}

          {/* TABS 2: Lists */}
          {activeTab === 'lists' && (
            binLists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {binLists.map((list) => (
                  <div key={list.id} className="glass-panel p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative border-gray-150 dark:border-gray-850">
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete collection list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        {list.is_private ? (
                          <span className="px-1.5 py-0.2 bg-gray-50 dark:bg-gray-900 text-gray-450 text-[9px] font-bold uppercase rounded border border-gray-200 dark:border-gray-800 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Private
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 bg-emerald-500/5 text-emerald-600 text-[9px] font-bold uppercase rounded border border-emerald-500/10 flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5" />
                            Public
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-gray-950 dark:text-white text-sm">
                        {list.name}
                      </h3>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {list.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-850 pt-3.5 mt-4">
                      <span className="text-[10px] text-gray-550 font-bold dark:text-gray-400">
                        {list.item_count} entries
                      </span>
                      <div className="flex items-center gap-2">
                        {!list.is_private && (
                          <button
                            onClick={() => handleShareList(list)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="Copy share link"
                          >
                            {copiedListId === list.id ? (
                              <><Check className="w-3 h-3 text-emerald-500" /> Copied!</>
                            ) : (
                              <><Copy className="w-3 h-3" /> Share</>
                            )}
                          </button>
                        )}
                        <Link
                          href={`/discover?listId=${list.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Open List
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-16 text-center flex flex-col items-center justify-center gap-3">
                <List className="w-12 h-12 text-gray-300 dark:text-gray-700 animate-pulse" />
                <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">No collections yet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-450 max-w-sm">
                  Create custom collections of BINs here.
                </p>
                <button
                  onClick={() => setListModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create List
                </button>
              </div>
            )
          )}

          {/* TABS 3: Bookmarks */}
          {activeTab === 'bookmarks' && (
            bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks.map((list) => (
                  <div key={list.bookmark_id} className="glass-panel p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative border-gray-150 dark:border-gray-850">
                    <button
                      onClick={() => handleRemoveBookmark(list.id)}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Unbookmark list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="px-1.5 py-0.2 bg-gray-50 dark:bg-gray-900 text-gray-450 text-[9px] font-bold uppercase rounded border border-gray-200 dark:border-gray-800 flex items-center gap-1">
                          <User className="w-2.5 h-2.5" />
                          By {list.owner_name}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-gray-950 dark:text-white text-sm">
                        {list.name}
                      </h3>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {list.description || 'No description.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-850 pt-3.5 mt-4">
                      <span className="text-[10px] text-gray-550 font-bold dark:text-gray-400">
                        {list.item_count} entries
                      </span>
                      <Link
                        href={`/discover?listId=${list.id}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Inspect List
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-16 text-center flex flex-col items-center justify-center gap-3">
                <FolderPlus className="w-12 h-12 text-gray-300 dark:text-gray-700 animate-pulse" />
                <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">No bookmarked lists yet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-450 max-w-sm">
                  Bookmark public collections created by other developers in the Discover panel.
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="p-6 sm:p-8">
          {dataLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          ) : myReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myReviews.map((review) => (
                <a
                  key={review.id}
                  href={`/bin/${review.bin}`}
                  className="glass-panel p-4 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-gray-150 dark:border-gray-850 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-gray-900 dark:text-white tracking-widest group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {review.bin}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
                      ))}
                    </div>
                  </div>
                  {review.comment ? (
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 italic">
                      "{review.comment}"
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-600 italic">No comment left.</p>
                  )}
                  <span className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-auto">
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center border border-amber-200 dark:border-amber-900">
                <MessageSquare className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">No reviews yet</h3>
              <p className="text-xs text-gray-500 dark:text-gray-450 max-w-sm text-center">
                Look up any BIN and leave a community review. Your reviews will appear here.
              </p>
              <a href="/" className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95">
                Start Reviewing BINs
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Create List Modal */}
      {listModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleCreateList}
            className="relative w-full max-w-md bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-3xl shadow-2xl p-8 animate-zoom-in"
          >
            <button
              type="button"
              onClick={() => setListModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-950 dark:hover:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-mono font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Create Bin List
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="My BIN collection"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  placeholder="Add a description..."
                  value={listDesc}
                  onChange={(e) => setListDesc(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    {listPrivate ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                    {listPrivate ? 'Private' : 'Public'}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-550 mt-1">
                    {listPrivate ? 'Only you can access' : 'Anyone can discover and search'}
                  </span>
                </div>

                {/* Simple Switch */}
                <button
                  type="button"
                  onClick={() => setListPrivate(!listPrivate)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    listPrivate ? 'bg-gray-300 dark:bg-gray-700' : 'bg-blue-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      listPrivate ? 'translate-x-0' : 'translate-x-5'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-2">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold leading-normal">
                  Your current filters will be saved with this list. Maximum 20,000 entries.
                </span>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setListModalOpen(false)}
                  className="flex-1 py-3 border border-gray-250 dark:border-gray-800 text-gray-850 dark:text-gray-200 text-xs font-bold uppercase rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingList}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {creatingList ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
