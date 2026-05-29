import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getPublicListByToken, getListReviews, upsertListReview } from '@/lib/dbBlog';

function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  return verifySession(token);
}

export async function GET(request, { params }) {
  try {
    const { token } = params;
    const result = await getPublicListByToken(token);
    if (!result || result.list.is_private) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }
    const reviews = await getListReviews(result.list.id);
    const avg = reviews.length
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null;
    return NextResponse.json({ success: true, reviews, averageRating: avg, count: reviews.length });
  } catch (err) {
    console.error('GET /api/list/[token]/review error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const session = getAuthUser();
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to leave a review.' }, { status: 401 });
  }
  try {
    const { token } = params;
    const result = await getPublicListByToken(token);
    if (!result || result.list.is_private) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }
    const { rating, comment } = await request.json();
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    const success = await upsertListReview(session.id, result.list.id, rating, comment);
    return NextResponse.json({ success });
  } catch (err) {
    console.error('POST /api/list/[token]/review error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
