import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getBookmarks, addBookmark, removeBookmark } from '@/lib/dbBlog';

function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  return verifySession(token);
}

export async function GET(request) {
  const session = getAuthUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookmarks = await getBookmarks(session.id);
  return NextResponse.json({ success: true, bookmarks });
}

export async function POST(request) {
  const session = getAuthUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { listId } = await request.json();
    if (!listId) {
      return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
    }

    const success = await addBookmark(session.id, parseInt(listId, 10));
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = getAuthUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { listId } = await request.json();
    if (!listId) {
      return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
    }

    const success = await removeBookmark(session.id, parseInt(listId, 10));
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
