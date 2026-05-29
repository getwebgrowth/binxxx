import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getSavedBins, saveBin, unsaveBin } from '@/lib/dbBlog';

// Utility helper to authenticate requests
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

  const bins = await getSavedBins(session.id);
  return NextResponse.json({ success: true, bins });
}

export async function POST(request) {
  const session = getAuthUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { bin } = await request.json();
    if (!bin) {
      return NextResponse.json({ error: 'BIN is required' }, { status: 400 });
    }

    const success = await saveBin(session.id, bin);
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
    const { bin } = await request.json();
    if (!bin) {
      return NextResponse.json({ error: 'BIN is required' }, { status: 400 });
    }

    const success = await unsaveBin(session.id, bin);
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
