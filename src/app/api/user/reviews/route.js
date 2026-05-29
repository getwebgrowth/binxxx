import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getUserBinReviews } from '@/lib/dbBlog';

function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  return verifySession(token);
}

export async function GET() {
  const session = getAuthUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const reviews = await getUserBinReviews(session.id);
  return NextResponse.json({ success: true, reviews });
}
