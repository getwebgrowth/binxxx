import { NextResponse } from 'next/server';
import { getPublicListsByUser } from '@/lib/dbBlog';

// This returns ALL public lists across all users for the discover feed
// We reuse getPublicListsByUser but need a "get all public lists" variant
export async function GET() {
  try {
    // Import getBlogDb directly for a cross-user query
    const { default: Database } = await import('better-sqlite3');
    const path = await import('path');
    const BLOG_DB_FILE = path.join(process.cwd(), 'src', 'lib', 'blog.db');
    const db = new Database(BLOG_DB_FILE);

    const lists = db.prepare(`
      SELECT bl.*, u.username as owner_name,
        (SELECT COUNT(*) FROM bin_list_items WHERE list_id = bl.id) as item_count
      FROM bin_lists bl
      JOIN users u ON bl.user_id = u.id
      WHERE bl.is_private = 0 AND bl.share_token IS NOT NULL
      ORDER BY bl.created_at DESC
      LIMIT 10
    `).all();

    db.close();
    return NextResponse.json({ success: true, lists });
  } catch (err) {
    console.error('GET /api/user/lists/public error:', err);
    return NextResponse.json({ success: true, lists: [] });
  }
}
