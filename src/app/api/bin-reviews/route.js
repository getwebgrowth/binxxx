import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { upsertBinReview, getBinReviews } from '@/lib/dbBlog';

function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  return verifySession(token);
}

// GET: fetch reviews for a specific BIN
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bin = searchParams.get('bin');
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!bin) {
    return NextResponse.json({ error: 'bin param required' }, { status: 400 });
  }

  const result = await getBinReviews(bin, page, 9);
  return NextResponse.json({ success: true, ...result });
}

// POST: submit a new BIN review (requires auth)
export async function POST(request) {
  const session = getAuthUser();
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to leave a review.' }, { status: 401 });
  }

  try {
    const { bin, rating, comment } = await request.json();

    if (!bin || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'BIN and a valid rating (1-5) are required.' }, { status: 400 });
    }

    const success = await upsertBinReview(session.id, session.username, bin, rating, comment);
    return NextResponse.json({ success });
  } catch (err) {
    console.error('POST /api/bin-reviews error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
