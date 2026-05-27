import Link from 'next/link';
import { BookOpen, Calendar, User, ArrowRight, Tag, Search, Eye } from 'lucide-react';
import { getPosts } from '@/lib/dbBlog';

export const metadata = {
  title: 'CC Bins Blog - Payments Security & Credit Card BIN Intelligence',
  description: 'Stay updated with expert articles on fintech, secure routing, payment compliance, carding fraud mitigation, and advanced BIN intelligence.',
  keywords: 'BIN lookup, carding, fintech, payment security, 3D secure, BIN database, bank identification number',
  alternates: {
    canonical: 'https://ccbins.co/blog',
  },
  openGraph: {
    title: 'CC Bins Blog - Payments Security & Credit Card BIN Intelligence',
    description: 'Expert fintech insights and payment intelligence articles from the CC Bins team.',
    type: 'website',
    url: 'https://ccbins.co/blog',
  }
};

export default async function BlogPage({ searchParams }) {
  // Fetch all published posts
  const allPosts = await getPosts(false);
  
  // Extract categories for filter tabs
  const categories = ['All', ...new Set(allPosts.map(p => p.category))];
  
  const selectedCategory = searchParams.category || 'All';
  const searchQuery = searchParams.q || '';
  
  // Filter posts
  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Draft';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-up">
      {/* Blog Hero section */}
      <div className="text-center py-6 border-b border-gray-100 dark:border-gray-850">
        <span className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/30 rounded-full border border-blue-200/40 dark:border-blue-900/30 shadow-sm">
          Industry Insights & Knowledge
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-3 mb-2 flex items-center justify-center gap-2 flex-wrap">
          <BookOpen className="w-8 h-8 text-blue-500 shrink-0" />
          The CC Bins Blog
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
          Deep dives into global payment gateway setups, BIN database structures, routing optimization, and digital fraud risk management.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-blue-600 border-transparent text-white shadow-md shadow-blue-500/10'
                    : 'bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-850 text-gray-650 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-800'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Search Input Box */}
        <form action="/blog" method="GET" className="flex items-center relative w-full md:w-72">
          {selectedCategory !== 'All' && (
            <input type="hidden" name="category" value={selectedCategory} />
          )}
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-gray-950/40 border border-gray-200 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
        </form>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredPosts.map((post, idx) => (
            <article
              key={post.id}
              className="glass-panel p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[9px] font-extrabold uppercase rounded border border-blue-200/50 dark:border-blue-900/30">
                    {post.category}
                  </span>
                  
                  <div className="flex items-center gap-2 text-[10px] text-gray-450 dark:text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.published_at)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" />
                      {post.views || 0}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-extrabold text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2.5 leading-snug">
                  <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed font-medium mb-4">
                  {post.summary}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-150 dark:border-gray-850 pt-4 mt-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-650 dark:text-gray-300 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center text-[9px] text-white font-extrabold select-none">
                    {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span>{post.author_name}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:gap-1.5 transition-all"
                >
                  Read Article
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center flex flex-col items-center justify-center gap-3">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 animate-pulse" />
          <h3 className="font-extrabold text-gray-900 dark:text-white text-base">No articles found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-450 max-w-sm">
            We couldn't find any articles matching your search criteria. Try modifying your search keywords or resetting the category tabs.
          </p>
          <Link
            href="/blog"
            className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-250 dark:bg-gray-900 dark:hover:bg-gray-850 text-xs font-bold rounded-xl transition-colors border border-gray-200 dark:border-gray-800"
          >
            Clear Filters
          </Link>
        </div>
      )}
    </div>
  );
}
