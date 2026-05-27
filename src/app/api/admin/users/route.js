import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, hashPassword } from '@/lib/auth';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/dbBlog';

function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  return verifySession(token);
}

// Fetch all users
export async function GET() {
  try {
    const session = checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only administrators can manage users
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const users = await getUsers();
    return NextResponse.json(users);
  } catch (err) {
    console.error('API admin/users GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Create new user
export async function POST(request) {
  try {
    const session = checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, email, role } = body;

    if (!username || !password || !email) {
      return NextResponse.json({ error: 'Username, password, and email are required.' }, { status: 400 });
    }

    const encryptedPassword = hashPassword(password);

    const newId = await createUser({
      username,
      password: encryptedPassword,
      email,
      role: role || 'editor'
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (err) {
    console.error('API admin/users POST error:', err.message);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Update existing user
export async function PUT(request) {
  try {
    const session = checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, username, password, email, role } = body;

    if (!id || !username || !email) {
      return NextResponse.json({ error: 'ID, username, and email are required.' }, { status: 400 });
    }

    const updateData = {
      username,
      email,
      role: role || 'editor'
    };

    if (password && password.trim() !== '') {
      updateData.password = hashPassword(password);
    }

    const success = await updateUser(id, updateData);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'User not found or update failed.' }, { status: 404 });
    }
  } catch (err) {
    console.error('API admin/users PUT error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete user
export async function DELETE(request) {
  try {
    const session = checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    if (parseInt(id, 10) === 1) {
      return NextResponse.json({ error: 'Cannot delete primary admin user.' }, { status: 400 });
    }

    const success = await deleteUser(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'User not found or delete failed.' }, { status: 404 });
    }
  } catch (err) {
    console.error('API admin/users DELETE error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
