import { NextResponse } from 'next/server';
import { getTopBinReviewers, getRecentBinReviews, getMostReviewedBins } from '@/lib/dbBlog';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch base data
    const [topReviewers, recentReviews, mostReviewedRaw] = await Promise.all([
      getTopBinReviewers(6),
      getRecentBinReviews(9),
      getMostReviewedBins(6),
    ]);

    // Enrich mostReviewed with brand/bank/flag from the BIN database
    const binsDb = getDb();
    const mostReviewed = mostReviewedRaw.map(item => {
      try {
        const binInfo = binsDb.prepare(
          'SELECT brand, type, level, bank, country, flag FROM bins WHERE bin = ? LIMIT 1'
        ).get(item.bin);
        return { ...item, ...( binInfo || {}) };
      } catch (_) { return item; }
    });

    // Enrich recentReviews with brand/flag too
    const recentReviewsEnriched = recentReviews.map(item => {
      try {
        const binInfo = binsDb.prepare(
          'SELECT brand, flag FROM bins WHERE bin = ? LIMIT 1'
        ).get(item.bin);
        return { ...item, ...(binInfo || {}) };
      } catch (_) { return item; }
    });

    return NextResponse.json({
      success: true,
      topReviewers,
      mostReviewed,
      recentReviews: recentReviewsEnriched,
    });
  } catch (err) {
    console.error('GET /api/discover error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
