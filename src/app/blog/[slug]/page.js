import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft, Tag, Eye, Clock, Share2, Twitter, Facebook, ExternalLink } from 'lucide-react';
import { getPostBySlug, incrementPostViews } from '@/lib/dbBlog';
import { parseMarkdown } from '@/lib/markdown';

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Article Not Found - CC Bins',
    };
  }

  return {
    title: `${post.title} - CC Bins Blog`,
    description: post.summary,
    alternates: {
      canonical: `https://ccbins.co/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      url: `https://ccbins.co/blog/${post.slug}`,
      authors: [post.author_name]
    }
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post || !post.published_at) {
    notFound();
  }

  // Increment view counter in the database
  try {
    await incrementPostViews(post.id);
  } catch (err) {
    console.error("Failed to increment views:", err);
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Structured Data Schema for search engines & AI engine citations
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://ccbins.co/blog/${post.slug}#article`,
        "isPartOf": {
          "@type": "WebPage",
          "@id": `https://ccbins.co/blog/${post.slug}`,
          "url": `https://ccbins.co/blog/${post.slug}`,
          "name": post.title
        },
        "headline": post.title,
        "description": post.summary,
        "datePublished": post.published_at,
        "dateModified": post.updated_at || post.published_at,
        "author": {
          "@type": "Person",
          "name": post.author_name
        },
        "publisher": {
          "@type": "Organization",
          "name": "CC Bins",
          "url": "https://ccbins.co"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://ccbins.co/blog/${post.slug}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://ccbins.co"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://ccbins.co/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `https://ccbins.co/blog/${post.slug}`
          }
        ]
      }
    ]
  };

  // Render processed markdown
  const htmlContent = parseMarkdown(post.content);

  // Approximate reading time
  const wordCount = post.content.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-up">
      {/* JSON-LD Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Breadcrumbs Trail */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-950 dark:hover:text-white transition-colors">Home</Link>
        <span className="text-gray-305 dark:text-gray-800">/</span>
        <Link href="/blog" className="hover:text-gray-950 dark:hover:text-white transition-colors">Blog</Link>
        <span className="text-gray-355 dark:text-gray-800">/</span>
        <span className="text-gray-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
      </nav>

      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Blog List
        </Link>
      </div>

      {/* Article Header Card */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl -z-10" />

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200/50 dark:border-blue-900/30 text-[10px] uppercase font-bold">
            {post.category}
          </span>
          <span className="text-gray-300 dark:text-gray-800">|</span>
          <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at)}
          </span>
          <span className="text-gray-300 dark:text-gray-800">|</span>
          <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {readTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium italic border-l-2 border-blue-500 pl-4 my-1">
          {post.summary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-850 pt-5 mt-2">
          {/* Author Block */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center text-xs text-white font-extrabold shadow-sm select-none">
              {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 dark:text-white leading-none">{post.author_name}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-1">{post.author_email || 'contact@ccbins.co'}</span>
            </div>
          </div>

          {/* Social Share & Views */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
            <div className="flex items-center gap-1 select-none">
              <Eye className="w-4 h-4 text-gray-400" />
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content body */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row gap-8">
        {/* Left Side: Body Content */}
        <div className="flex-grow md:w-2/3">
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Author note / signature */}
          <div className="border-t border-gray-150 dark:border-gray-850 mt-10 pt-6">
            <div className="p-4 bg-gray-50/50 dark:bg-gray-950/20 border border-gray-200/50 dark:border-gray-850 rounded-2xl flex flex-col gap-2">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Editorial Standard Disclaimer</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                The information provided on the CC Bins intelligence network blog is intended for educational, integration, and security auditing purposes only. CC Bins holds no liability for card networks misuse. Verify all APIs on test gateways.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Meta sidebar */}
        <div className="md:w-1/3 flex flex-col gap-6 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-850 pt-6 md:pt-0 md:pl-6">
          {/* Tag Cloud */}
          {post.tags && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-500" />
                Related Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.split(',').map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-650 dark:text-gray-450 rounded-lg text-[10px] font-bold border border-gray-200/50 dark:border-gray-850"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share links */}
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-indigo-500" />
              Share Article
            </h3>
            
            <div className="flex flex-col gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://ccbins.co/blog/${post.slug}`)}`}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-gray-850 bg-white hover:bg-gray-50 dark:bg-gray-950/45 dark:hover:bg-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                Share on X (Twitter)
              </a>
              
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ccbins.co/blog/${post.slug}`)}`}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-gray-850 bg-white hover:bg-gray-50 dark:bg-gray-950/45 dark:hover:bg-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Facebook className="w-4 h-4 text-[#1877F2]" />
                Share on Facebook
              </a>
            </div>
          </div>
          
          {/* Quick ad link */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-blue-600/5 to-indigo-650/10 border border-blue-500/10 flex flex-col gap-2.5">
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400">Ad Placement</span>
            <h4 className="text-xs font-black text-gray-900 dark:text-white leading-snug">Advertise Your Services on CC Bins Network</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Reach thousands of daily fintech operators and developers. Placements start from $50/week.
            </p>
            <Link 
              href="/tools/book-ad"
              className="mt-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-[10px] font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition-colors"
            >
              Book Ad Slot &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
