"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2, 
  AlertCircle, 
  Check, 
  FileEdit,
  Globe,
  Settings,
  BookOpen,
  ArrowLeft,
  X
} from 'lucide-react';
import { parseMarkdown } from '@/lib/markdown';

export default function AdminBlogsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // List states
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [editingPost, setEditingPost] = useState(null); // null if listing, {}/post if creating/editing
  const [formMode, setFormMode] = useState('list'); // 'list', 'edit', 'create'
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    summary: '',
    category: 'Fintech',
    tags: '',
    content: '',
    published: false,
    published_at: null
  });
  
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false); // markdown editor vs preview

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        setError('Failed to fetch posts. Ensure you are logged in.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred loading articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // Check query params if we want to create immediately
    if (searchParams.get('new') === 'true') {
      handleCreateNew();
    }
  }, [searchParams]);

  // Handle auto slug generation
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => {
      const updates = { title };
      // Only auto-generate slug if we are creating a new post, or if slug was empty
      if (formMode === 'create' || !prev.slug) {
        updates.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // remove special chars
          .replace(/\s+/g, '-')         // replace spaces with hyphens
          .replace(/-+/g, '-')          // replace duplicate hyphens
          .trim();
      }
      return { ...prev, ...updates };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateNew = () => {
    setFormData({
      id: '',
      title: '',
      slug: '',
      summary: '',
      category: 'Fintech',
      tags: '',
      content: '',
      published: false,
      published_at: null
    });
    setFormMode('create');
    setPreviewMode(false);
    setFormError('');
  };

  const handleEditPost = (post) => {
    setFormData({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      category: post.category,
      tags: post.tags || '',
      content: post.content,
      published: !!post.published_at,
      published_at: post.published_at
    });
    setFormMode('edit');
    setPreviewMode(false);
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSaving(true);
    setFormError('');

    try {
      const url = '/api/admin/blogs';
      const method = formMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormMode('list');
        fetchPosts();
        router.replace('/admin/blogs');
      } else {
        setFormError(data.error || 'Failed to save article.');
      }
    } catch (err) {
      console.error(err);
      setFormError('An error occurred saving the post.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchPosts();
      } else {
        alert('Failed to delete post.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting post.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Draft';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-850 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6.5 h-6.5 text-indigo-500" />
            Article Management
          </h1>
          <p className="text-xs text-gray-550 dark:text-gray-400 font-medium">
            {formMode === 'list' && 'Write, edit, and publish SEO & AEO-ready blog posts.'}
            {formMode === 'create' && 'Compose a new article.'}
            {formMode === 'edit' && `Editing post: ${formData.title}`}
          </p>
        </div>
        
        {formMode === 'list' && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        )}
      </div>

      {formMode === 'list' ? (
        /* ==================== LISTING VIEW ==================== */
        <div className="flex flex-col gap-4">
          {error && (
            <div className="p-3.5 bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="glass-panel p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-xs text-gray-500">Loading articles...</span>
            </div>
          ) : posts.length > 0 ? (
            <div className="glass-panel overflow-hidden border border-gray-200/80 dark:border-gray-850">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-950/40 text-gray-400 dark:text-gray-500 border-b border-gray-150 dark:border-gray-850 font-bold uppercase tracking-wider">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Views</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/10 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-gray-900 dark:text-white text-xs">{post.title}</span>
                            <span className="text-[10px] text-gray-400 font-mono">/{post.slug}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-extrabold uppercase border border-blue-200/40 dark:border-blue-900/20">
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400 font-medium">
                          {formatDate(post.published_at)}
                        </td>
                        <td className="p-4 font-mono font-bold text-gray-900 dark:text-gray-300">
                          {post.views || 0}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            post.published_at 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20'
                          }`}>
                            {post.published_at ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {post.published_at && (
                              <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 text-gray-550 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-450 rounded-lg transition-colors cursor-pointer"
                                title="View live page"
                              >
                                <Globe className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-1.5 bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400 text-gray-550 dark:text-gray-400 hover:text-indigo-650 dark:hover:text-indigo-450 rounded-lg transition-colors cursor-pointer"
                              title="Edit post"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-400 text-gray-550 dark:text-gray-400 hover:text-red-650 dark:hover:text-red-450 rounded-lg transition-colors cursor-pointer"
                              title="Delete post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center flex flex-col items-center justify-center gap-3">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 animate-pulse" />
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">No Articles Found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-450 max-w-sm">
                Write some articles to explain BIN structure, security compliance, or payments routing!
              </p>
              <button
                onClick={handleCreateNew}
                className="mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Compose First Post
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ==================== CREATE / EDIT FORM VIEW ==================== */
        <form onSubmit={handleFormSubmit} className="glass-panel p-6 flex flex-col gap-5 relative animate-fade-up">
          {formError && (
            <div className="p-3.5 bg-red-500/5 border border-red-500/20 text-red-650 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Actions Top */}
          <div className="flex justify-between items-center gap-3 border-b border-gray-150 dark:border-gray-850 pb-3">
            <button
              type="button"
              onClick={() => {
                setFormMode('list');
                router.replace('/admin/blogs');
              }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Cancel and Return
            </button>

            {/* Preview Toggle */}
            <div className="flex bg-gray-100/50 dark:bg-gray-950/60 p-1 border border-gray-200 dark:border-gray-800 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  !previewMode
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-450 shadow-sm border border-gray-250/20 dark:border-gray-850'
                    : 'text-gray-500'
                }`}
              >
                Write (Markdown)
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  previewMode
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-450 shadow-sm border border-gray-250/20 dark:border-gray-850'
                    : 'text-gray-500'
                }`}
              >
                Live Preview
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Title */}
            <div className="md:col-span-8 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Post Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Understanding BIN Numbers: The Core of Credit Card Intelligence"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold transition-all"
              />
            </div>

            {/* Slug */}
            <div className="md:col-span-4 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">URL Slug *</label>
              <input
                type="text"
                required
                placeholder="understanding-bin-numbers"
                value={formData.slug}
                name="slug"
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono transition-all"
              />
            </div>

            {/* Summary */}
            <div className="md:col-span-12 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                <label>SEO Excerpt Summary *</label>
                <span>{formData.summary.length}/200 recommended</span>
              </div>
              <textarea
                required
                maxLength={450}
                placeholder="A compelling, SEO-friendly summary that will appear on meta descriptions and archive list cards."
                value={formData.summary}
                name="summary"
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all h-20 resize-none"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-4 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-850 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold transition-all cursor-pointer"
              >
                <option value="Fintech">Fintech</option>
                <option value="Security">Security</option>
                <option value="General">General</option>
                <option value="Updates">Updates</option>
              </select>
            </div>

            {/* Tags */}
            <div className="md:col-span-8 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="BIN, Payments, 3DS, SCA"
                value={formData.tags}
                name="tags"
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
            </div>

            {/* Editor Area */}
            <div className="md:col-span-12 flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Content Body (Markdown Supported) *</label>
              
              {!previewMode ? (
                <textarea
                  required
                  placeholder="# Enter heading here&#10;Write content here. Use **bold**, `code` ticks, bullet lists, or links like [Text](url)."
                  value={formData.content}
                  name="content"
                  onChange={handleInputChange}
                  className="w-full min-h-[300px] p-4 text-xs sm:text-sm font-mono bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y custom-scrollbar"
                />
              ) : (
                <div className="w-full min-h-[300px] p-6 bg-white dark:bg-[#070b13] border border-gray-250 dark:border-gray-850 rounded-xl overflow-y-auto max-h-[500px] custom-scrollbar">
                  {formData.content ? (
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content) }}
                    />
                  ) : (
                    <span className="text-gray-400 dark:text-gray-650 italic text-xs">Nothing to preview. Type something in write mode.</span>
                  )}
                </div>
              )}
            </div>

            {/* Published checkbox */}
            <div className="md:col-span-12 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-950/40 border border-gray-200/50 dark:border-gray-850 p-4 rounded-xl shadow-inner mt-2">
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex flex-col">
                <label htmlFor="published" className="text-xs font-bold text-gray-900 dark:text-white cursor-pointer select-none">
                  Publish to Public Blog Immediately
                </label>
                <span className="text-[10px] text-gray-400 dark:text-gray-550 font-medium">
                  If unchecked, this post will save as a Draft and won't be visible on the public listing.
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions Bottom */}
          <div className="flex items-center gap-3 border-t border-gray-150 dark:border-gray-850 pt-5 mt-3">
            <button
              type="submit"
              disabled={formSaving}
              className="flex-grow py-3 px-5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {formSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Article
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormMode('list');
                router.replace('/admin/blogs');
              }}
              className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-650 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-850 rounded-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-800 text-center"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
