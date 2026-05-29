import { getDb } from '@/lib/db';

const BASE_URL = 'https://ccbins.co';
const BINS_PER_PAGE = 45000;

export async function GET(request, { params }) {
  const page = parseInt(params.page, 10);

  if (isNaN(page) || page < 0) {
    return new Response('Invalid page', { status: 400 });
  }

  try {
    const db = getDb();
    const offset = page * BINS_PER_PAGE;
    const rows = db
      .prepare('SELECT bin FROM bins LIMIT ? OFFSET ?')
      .all(BINS_PER_PAGE, offset);

    if (!rows || rows.length === 0) {
      return new Response('Not Found', { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const urlEntries = rows
      .filter(row => row.bin)
      .map(
        row => `  <url>
    <loc>${BASE_URL}/bin/${row.bin}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // Cache for 24 hours at the edge — BIN data changes daily
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    console.error(`BIN sitemap page ${page} error:`, err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
