import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { 
  getBinLists, 
  createBinList, 
  deleteBinList, 
  getBinListItems, 
  addBinToList, 
  removeBinFromList 
} from '@/lib/dbBlog';

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

  const { searchParams } = new URL(request.url);
  const listId = searchParams.get('listId');

  if (listId) {
    const items = await getBinListItems(parseInt(listId, 10));
    return NextResponse.json({ success: true, items });
  }

  const lists = await getBinLists(session.id);
  return NextResponse.json({ success: true, lists });
}

export async function POST(request) {
  const session = getAuthUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { name, description, isPrivate } = body;
      if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
      }
      const listId = await createBinList(session.id, name, description, isPrivate);
      return NextResponse.json({ success: true, listId });
    }

    if (action === 'addItem') {
      const { listId, bin } = body;
      if (!listId || !bin) {
        return NextResponse.json({ error: 'List ID and BIN are required' }, { status: 400 });
      }
      const success = await addBinToList(parseInt(listId, 10), bin);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
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
    const { action, listId, bin } = await request.json();

    if (action === 'deleteList') {
      if (!listId) {
        return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
      }
      const success = await deleteBinList(session.id, parseInt(listId, 10));
      return NextResponse.json({ success });
    }

    if (action === 'removeItem') {
      if (!listId || !bin) {
        return NextResponse.json({ error: 'List ID and BIN are required' }, { status: 400 });
      }
      const success = await removeBinFromList(parseInt(listId, 10), bin);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
