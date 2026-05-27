import Link from 'next/link';
import { getPosts, isUsingMySQL } from '@/lib/dbBlog';
import { 
  FileText, 
  Eye, 
  Layers, 
  Database,
  ArrowRight,
  Sparkles,
  BookOpen,
  AlertTriangle,
  ServerCrash,
  ExternalLink
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const posts = await getPosts(true);
  const isMySQL = await isUsingMySQL();

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.published_at).length;
  const draftPosts = totalPosts - publishedPosts;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  // Group by category for a quick stat
  const categoriesCount = [...new Set(posts.map(p => p.category))].length;

  // Get top 5 most viewed posts
  const topPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Console Dashboard</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Overview of blog performance, search engine visibility, and database status.
        </p>
      </div>

      {/* Database Warning Banner if using fallback */}
      {!isMySQL && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3 text-xs leading-relaxed text-gray-650 dark:text-gray-400 font-medium shadow-inner">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-gray-900 dark:text-amber-400">Currently Using Local JSON Database Fallback</span>
            <p>
              Your MySQL environment variables are not configured or the connection is failing. The blog is currently reading/writing to <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-900 rounded font-mono text-[10px]">src/lib/db_fallback.json</code>.
            </p>
            <p className="mt-1 font-bold text-gray-800 dark:text-gray-300">
              To activate MySQL, add these environment variables to your shell or <code className="font-mono text-[10px]">.env.local</code>:
            </p>
            <pre className="bg-gray-100/50 dark:bg-gray-900/50 p-2.5 rounded-xl font-mono text-[10px] text-blue-650 dark:text-blue-400 border border-gray-200 dark:border-gray-850 mt-1">
{`DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bx_bin_db
DB_PORT=3306`}
            </pre>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Posts */}
        <div className="glass-panel p-5 flex flex-col gap-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-blue-500/5 blur-lg" />
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Articles</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white leading-none font-mono mt-1">{totalPosts}</span>
          <div className="flex justify-between items-center text-[10px] text-gray-550 dark:text-gray-500 font-bold border-t border-gray-100 dark:border-gray-850 pt-2.5 mt-3 w-full">
            <span>{publishedPosts} Published</span>
            <span>{draftPosts} Drafts</span>
          </div>
        </div>

        {/* Total Views */}
        <div className="glass-panel p-5 flex flex-col gap-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-indigo-500/5 blur-lg" />
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Article Views</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white leading-none font-mono mt-1">{totalViews.toLocaleString()}</span>
          <div className="text-[10px] text-gray-550 dark:text-gray-500 font-bold border-t border-gray-100 dark:border-gray-850 pt-2.5 mt-3 w-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Across all active content</span>
          </div>
        </div>

        {/* Categories */}
        <div className="glass-panel p-5 flex flex-col gap-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-violet-500/5 blur-lg" />
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Categories</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white leading-none font-mono mt-1">{categoriesCount}</span>
          <div className="text-[10px] text-gray-550 dark:text-gray-500 font-bold border-t border-gray-100 dark:border-gray-850 pt-2.5 mt-3 w-full flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-violet-500" />
            <span>Active tags & categories</span>
          </div>
        </div>

        {/* DB Connection Status */}
        <div className="glass-panel p-5 flex flex-col gap-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-emerald-500/5 blur-lg" />
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Database Link</span>
          <span className={`text-sm font-extrabold uppercase mt-2.5 leading-none ${isMySQL ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {isMySQL ? 'MySQL Server Connected' : 'Fallback JSON Storage'}
          </span>
          <div className="text-[10px] text-gray-550 dark:text-gray-500 font-bold border-t border-gray-100 dark:border-gray-850 pt-2.5 mt-auto w-full flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-gray-400" />
            <span>Driver: mysql2/promise</span>
          </div>
        </div>
      </div>

      {/* Grid: Popular Articles & Console Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Top Viewed Posts */}
        <div className="lg:col-span-8 glass-panel p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-850 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              Top Performing Articles
            </h3>
            <Link 
              href="/admin/blogs" 
              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              Manage posts
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {topPosts.length > 0 ? (
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-850">
              {topPosts.map((post) => (
                <div key={post.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="font-bold text-xs text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate inline-flex items-center gap-1"
                    >
                      {post.title}
                      <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                    </Link>
                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                      {post.category} • {post.author_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      post.published_at 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20'
                    }`}>
                      {post.published_at ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-900 dark:text-gray-300 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      {post.views || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-500 dark:text-gray-450">
              No blog articles created yet. Get started by writing your first article.
            </div>
          )}
        </div>

        {/* Right: Quick actions panel */}
        <div className="lg:col-span-4 glass-panel p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-850 pb-3">
            Quick Actions
          </h3>

          <div className="flex flex-col gap-3">
            <Link
              href="/admin/blogs?new=true"
              className="w-full text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition-colors"
            >
              Compose New Post
            </Link>

            <Link
              href="/admin/blogs"
              className="w-full text-center py-2.5 px-4 bg-gray-100 hover:bg-gray-250 dark:bg-gray-900 dark:hover:bg-gray-850 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 rounded-xl transition-colors border border-gray-200 dark:border-gray-800"
            >
              Manage Blog Archive
            </Link>

            <Link
              href="/admin/users"
              className="w-full text-center py-2.5 px-4 bg-gray-100 hover:bg-gray-250 dark:bg-gray-900 dark:hover:bg-gray-850 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 rounded-xl transition-colors border border-gray-200 dark:border-gray-800"
            >
              Manage Team Accounts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
