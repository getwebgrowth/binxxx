import { NextResponse } from 'next/server';
import { getUserByUsername } from '@/lib/dbBlog';
import { hashPassword, createSession } from '@/lib/auth';

// Authenticate administrator credentials
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Verify hashed password
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Generate signed session
    const sessionToken = createSession(user);

    // Prepare response with httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      }
    });

    response.cookies.set({
      name: 'admin_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (err) {
    console.error('Login Auth API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Log out active sessions
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}

// Support GET for simple logout actions too
export async function GET() {
  const response = NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  
  response.cookies.set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
