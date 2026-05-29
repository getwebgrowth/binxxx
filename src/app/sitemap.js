import { getDb } from '@/lib/db';
import { getPosts } from '@/lib/dbBlog';

const BASE_URL = 'https://ccbins.co';
const BINS_PER_PAGE = 45000;

export default async function sitemap() {
  // 1. Static pages — use real known dates, not always new Date()
  const staticPages = [
    { url: BASE_URL,                        lastModified: new Date() },
    { url: `${BASE_URL}/discover`,          lastModified: new Date() },
    { url: `${BASE_URL}/tools`,             lastModified: new Date() },
    { url: `${BASE_URL}/free-bin-checker-api`, lastModified: new Date() },
    { url: `${BASE_URL}/blog`,              lastModified: new Date() },
    { url: `${BASE_URL}/privacy`,           lastModified: new Date('2026-05-27') },
    { url: `${BASE_URL}/terms`,             lastModified: new Date('2026-05-27') },
    { url: `${BASE_URL}/contact`,           lastModified: new Date('2026-01-01') },
    { url: `${BASE_URL}/tools/generator`,   lastModified: new Date('2026-01-01') },
    { url: `${BASE_URL}/tools/book-ad`,     lastModified: new Date('2026-01-01') },
  ];

  // 2. Competitor comparison pages
  const comparePages = [];
  try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(process.cwd(), 'src', 'data', 'competitors.json');
    const competitors = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    Object.keys(competitors).forEach((key) => {
      comparePages.push({ url: `${BASE_URL}/compare/${key}`, lastModified: new Date() });
    });
  } catch (err) {
    console.error('Failed to fetch competitors for sitemap:', err);
  }

  // 3. Blog posts — use real published/updated dates
  const blogPages = [];
  try {
    const posts = await getPosts(false);
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        if (post.slug) {
          blogPages.push({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.updated_at
              ? new Date(post.updated_at)
              : new Date(post.published_at || Date.now()),
          });
        }
      });
    }
  } catch (err) {
    console.error('Failed to fetch blog posts for sitemap:', err);
  }

  // 4. BIN sub-sitemap index entries
  // Each page at /sitemap/bins/[page] holds up to 45,000 BIN URLs.
  // Google supports up to 50,000 URLs and 50 MB per sitemap file.
  // This root sitemap.xml acts as the sitemap INDEX referencing each sub-file.
  const binSitemapRefs = [];
  try {
    const db = getDb();
    const { total } = db.prepare('SELECT COUNT(*) as total FROM bins').get();
    const pageCount = Math.ceil(total / BINS_PER_PAGE);
    for (let i = 0; i < pageCount; i++) {
      binSitemapRefs.push({
        url: `${BASE_URL}/sitemap/bins/${i}`,
        lastModified: new Date(),
      });
    }
  } catch (err) {
    console.error('Failed to count BINs for sitemap index:', err);
  }

  return [...staticPages, ...comparePages, ...blogPages, ...binSitemapRefs];
}
