import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getPosts, createPost, updatePost, deletePost } from '@/lib/dbBlog';

function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  return verifySession(token);
}

// Fetch all posts (including drafts)
export async function GET() {
  try {
    const session = checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await getPosts(true);
    return NextResponse.json(posts);
  } catch (err) {
    console.error('API admin/blogs GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Create new post
export async function POST(request) {
  try {
    const session = checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, content, summary, category, tags, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required.' }, { status: 400 });
    }

    // Auto-generate published_at timestamp if active
    const published_at = published ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;

    const newId = await createPost({
      title,
      slug,
      content,
      summary: summary || '',
      category: category || 'General',
      tags: tags || '',
      author_id: session.id,
      published_at
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (err) {
    console.error('API admin/blogs POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Update existing post
export async function PUT(request) {
  try {
    const session = checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, slug, content, summary, category, tags, published } = body;

    if (!id || !title || !slug || !content) {
      return NextResponse.json({ error: 'ID, title, slug, and content are required.' }, { status: 400 });
    }

    // Handle draft vs published status changes
    let published_at = null;
    if (published) {
      // Keep old timestamp if it was already published, otherwise generate a new one
      published_at = body.published_at || new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    const success = await updatePost(id, {
      title,
      slug,
      content,
      summary: summary || '',
      category: category || 'General',
      tags: tags || '',
      published_at
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Post not found or update failed.' }, { status: 404 });
    }
  } catch (err) {
    console.error('API admin/blogs PUT error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete post
export async function DELETE(request) {
  try {
    const session = checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const success = await deletePost(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Post not found or delete failed.' }, { status: 404 });
    }
  } catch (err) {
    console.error('API admin/blogs DELETE error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
