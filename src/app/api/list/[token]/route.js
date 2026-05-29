import { NextResponse } from 'next/server';
import { getPublicListByToken } from '@/lib/dbBlog';

export async function GET(request, { params }) {
  try {
    const { token } = params;
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const result = await getPublicListByToken(token);

    if (!result) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    // Only expose public lists to unauthenticated users
    if (result.list.is_private) {
      return NextResponse.json({ error: 'This list is private' }, { status: 403 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('GET /api/list/[token] error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
