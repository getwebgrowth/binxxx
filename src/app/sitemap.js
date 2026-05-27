import { getDb } from '@/lib/db';
import { getPosts } from '@/lib/dbBlog';

export default async function sitemap() {
  const baseUrl = 'https://ccbins.co';

  // 1. Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/discover`, lastModified: new Date() },
    { url: `${baseUrl}/tools`, lastModified: new Date() },
    { url: `${baseUrl}/api`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  // 2. Blog posts
  const blogPages = [];
  try {
    const posts = await getPosts(false);
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        if (post.slug) {
          blogPages.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.published_at || Date.now()),
          });
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch blog posts for sitemap:", err);
  }

  // 3. Dynamic BIN pages (limit to a sample of 150 prefixes to maintain optimal sitemap file sizes)
  const binPages = [];
  try {
    const db = getDb();
    const rows = db.prepare("SELECT bin FROM bins LIMIT 150").all();
    if (rows && rows.length > 0) {
      rows.forEach(row => {
        if (row.bin) {
          binPages.push({
            url: `${baseUrl}/bin/${row.bin}`,
            lastModified: new Date(),
          });
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch BINs for sitemap:", err);
  }

  return [...staticPages, ...blogPages, ...binPages];
}
