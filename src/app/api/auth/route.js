import { NextResponse } from 'next/server';
import { getUserByUsername, createUser } from '@/lib/dbBlog';
import { hashPassword, createSession, verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Check session status / profile
export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_session')?.value;
    const session = verifySession(token);

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        username: session.username,
        role: session.role
      }
    });
  } catch (err) {
    console.error('Session check error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Handles Login, Registration, and Logout
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // --- LOGOUT ACTION ---
    if (action === 'logout') {
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

    // --- LOGIN ACTION ---
    if (action === 'login') {
      const { username, password } = body;
      if (!username || !password) {
        return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
      }

      const user = await getUserByUsername(username);
      if (!user) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
      }

      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
      }

      const sessionToken = createSession(user);
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
    }

    // --- REGISTER ACTION ---
    if (action === 'register' || action === 'signup') {
      const { username, password, confirmPassword, captchaText, expectedCaptcha } = body;

      if (!username || !password || !confirmPassword || !captchaText) {
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
      }

      if (password !== confirmPassword) {
        return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
      }

      if (captchaText.toLowerCase().replace(/\s+/g, '') !== expectedCaptcha.toLowerCase().replace(/\s+/g, '')) {
        return NextResponse.json({ error: 'Invalid CAPTCHA code.' }, { status: 400 });
      }

      // Check if username exists
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 });
      }

      // Create new user (role: 'user')
      const hashedPassword = hashPassword(password);
      const newUserId = await createUser({
        username,
        password: hashedPassword,
        email: `${username.toLowerCase()}@ccbins.co`, // dummy email matching domain
        role: 'user'
      });

      const userObj = {
        id: newUserId,
        username,
        role: 'user'
      };

      const sessionToken = createSession(userObj);
      const response = NextResponse.json({
        success: true,
        user: userObj
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
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err) {
    console.error('Unified Auth Route Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
