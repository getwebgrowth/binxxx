import { NextResponse } from 'next/server';
import { getUserProfile, getPublicListsByUser } from '@/lib/dbBlog';

export async function GET(request, { params }) {
  try {
    const { username } = params;
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const profile = await getUserProfile(username);
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const lists = await getPublicListsByUser(username);

    return NextResponse.json({ success: true, profile, lists });
  } catch (err) {
    console.error('GET /api/profile/[username] error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
