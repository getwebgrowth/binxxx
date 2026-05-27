import path from 'path';
import Database from 'better-sqlite3';

const BLOG_DB_FILE = path.join(process.cwd(), 'src', 'lib', 'blog.db');

// Check if MySQL env variables are configured
const isDbConfigured = () => {
  return !!(
    process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_NAME
  );
};

let pool = null;
let useFallback = !isDbConfigured();
let initChecked = false;

let blogDb = null;
function getBlogDb() {
  if (useFallback) {
    if (!blogDb) {
      blogDb = new Database(BLOG_DB_FILE);
      // Enable foreign keys
      blogDb.pragma('foreign_keys = ON');
    }
    return blogDb;
  }
  return null;
}

// Dynamic MySQL Pool Initializer
async function getPool() {
  if (useFallback) return null;
  if (pool) return pool;

  try {
    const mysql = await import('mysql2/promise');
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 5000 // 5 seconds
    });
    
    // Quick ping to check connectivity
    const conn = await pool.getConnection();
    conn.release();
    useFallback = false;
    initChecked = true;
    console.log("SUCCESS: Secure MySQL database connected.");
    return pool;
  } catch (err) {
    console.warn("WARNING: MySQL connection test failed. Falling back to local SQLite database. Error:", err.message);
    useFallback = true;
    pool = null;
    initChecked = true;
    return null;
  }
}

/**
 * Checks if the system is currently using the MySQL server.
 * @returns {Promise<boolean>}
 */
export async function isUsingMySQL() {
  await getPool();
  return !useFallback;
}

// ==========================================
// BLOG POSTS CRUD OPERATIONS
// ==========================================

export async function getPosts(includeDrafts = false) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      let query = `
        SELECT p.*, u.username as author_name, u.email as author_email 
        FROM posts p 
        JOIN users u ON p.author_id = u.id
      `;
      if (!includeDrafts) {
        query += ` WHERE p.published_at IS NOT NULL AND p.published_at <= NOW()`;
      }
      query += ` ORDER BY p.published_at DESC, p.created_at DESC`;
      const [rows] = await db.query(query);
      return rows;
    } catch (err) {
      console.error("MySQL getPosts failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    let query = `
      SELECT p.*, u.username as author_name, u.email as author_email 
      FROM posts p 
      JOIN users u ON p.author_id = u.id
    `;
    if (!includeDrafts) {
      query += ` WHERE p.published_at IS NOT NULL AND p.published_at <= datetime('now')`;
    }
    query += ` ORDER BY p.published_at DESC, p.created_at DESC`;
    return db.prepare(query).all();
  } catch (err) {
    console.error("SQLite getPosts failed:", err.message);
    return [];
  }
}

export async function getPostBySlug(slug) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      const query = `
        SELECT p.*, u.username as author_name, u.email as author_email 
        FROM posts p 
        JOIN users u ON p.author_id = u.id 
        WHERE p.slug = ? 
        LIMIT 1
      `;
      const [rows] = await db.query(query, [slug]);
      return rows[0] || null;
    } catch (err) {
      console.error("MySQL getPostBySlug failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    const query = `
      SELECT p.*, u.username as author_name, u.email as author_email 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      WHERE p.slug = ? 
      LIMIT 1
    `;
    return db.prepare(query).get(slug) || null;
  } catch (err) {
    console.error("SQLite getPostBySlug failed:", err.message);
    return null;
  }
}

export async function createPost(postData) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      const query = `
        INSERT INTO posts (title, slug, content, summary, category, tags, author_id, published_at, views)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
      `;
      const values = [
        postData.title,
        postData.slug,
        postData.content,
        postData.summary,
        postData.category || 'General',
        postData.tags || '',
        postData.author_id || 1,
        postData.published_at || null
      ];
      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (err) {
      console.error("MySQL createPost failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    const query = `
      INSERT INTO posts (title, slug, content, summary, category, tags, author_id, published_at, views, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
    `;
    const res = db.prepare(query).run(
      postData.title,
      postData.slug,
      postData.content,
      postData.summary,
      postData.category || 'General',
      postData.tags || '',
      postData.author_id || 1,
      postData.published_at || null
    );
    return res.lastInsertRowid;
  } catch (err) {
    console.error("SQLite createPost failed:", err.message);
    throw err;
  }
}

export async function updatePost(id, postData) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      const query = `
        UPDATE posts 
        SET title = ?, slug = ?, content = ?, summary = ?, category = ?, tags = ?, published_at = ?
        WHERE id = ?
      `;
      const values = [
        postData.title,
        postData.slug,
        postData.content,
        postData.summary,
        postData.category || 'General',
        postData.tags || '',
        postData.published_at || null,
        id
      ];
      const [result] = await db.query(query, values);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("MySQL updatePost failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    const query = `
      UPDATE posts 
      SET title = ?, slug = ?, content = ?, summary = ?, category = ?, tags = ?, published_at = ?, updated_at = datetime('now')
      WHERE id = ?
    `;
    const res = db.prepare(query).run(
      postData.title,
      postData.slug,
      postData.content,
      postData.summary,
      postData.category || 'General',
      postData.tags || '',
      postData.published_at || null,
      id
    );
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite updatePost failed:", err.message);
    return false;
  }
}

export async function deletePost(id) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      const [result] = await db.query("DELETE FROM posts WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("MySQL deletePost failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    const res = db.prepare("DELETE FROM posts WHERE id = ?").run(id);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite deletePost failed:", err.message);
    return false;
  }
}

export async function incrementPostViews(id) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      await db.query("UPDATE posts SET views = views + 1 WHERE id = ?", [id]);
      return true;
    } catch (err) {
      console.error("MySQL incrementPostViews failed.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    const res = db.prepare("UPDATE posts SET views = views + 1 WHERE id = ?").run(id);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite incrementPostViews failed:", err.message);
    return false;
  }
}

// ==========================================
// USER MANAGEMENT CRUD OPERATIONS
// ==========================================

export async function getUsers() {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      const [rows] = await db.query("SELECT id, username, email, role, created_at FROM users ORDER BY id ASC");
      return rows;
    } catch (err) {
      console.error("MySQL getUsers failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    return db.prepare("SELECT id, username, email, role, created_at FROM users ORDER BY id ASC").all();
  } catch (err) {
    console.error("SQLite getUsers failed:", err.message);
    return [];
  }
}

export async function getUserByUsername(username) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      const [rows] = await db.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
      return rows[0] || null;
    } catch (err) {
      console.error("MySQL getUserByUsername failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    return db.prepare("SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1").get(username) || null;
  } catch (err) {
    console.error("SQLite getUserByUsername failed:", err.message);
    return null;
  }
}

export async function createUser(userData) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      const query = "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
      const [result] = await db.query(query, [userData.username, userData.password, userData.email, userData.role || 'editor']);
      return result.insertId;
    } catch (err) {
      console.error("MySQL createUser failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    
    // Check if exists
    const existing = db.prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(?)").get(userData.username);
    if (existing) {
      throw new Error("Username already exists");
    }

    const res = db.prepare(`
      INSERT INTO users (username, password, email, role, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(userData.username, userData.password, userData.email, userData.role || 'editor');
    return res.lastInsertRowid;
  } catch (err) {
    console.error("SQLite createUser failed:", err.message);
    throw err;
  }
}

export async function updateUser(id, userData) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      let query, params;
      if (userData.password) {
        query = "UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?";
        params = [userData.username, userData.password, userData.email, userData.role, id];
      } else {
        query = "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?";
        params = [userData.username, userData.email, userData.role, id];
      }
      const [result] = await db.query(query, params);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("MySQL updateUser failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    const db = getBlogDb();
    let res;
    if (userData.password) {
      res = db.prepare("UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?")
        .run(userData.username, userData.password, userData.email, userData.role, id);
    } else {
      res = db.prepare("UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?")
        .run(userData.username, userData.email, userData.role, id);
    }
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite updateUser failed:", err.message);
    return false;
  }
}

export async function deleteUser(id) {
  const isMySQL = await isUsingMySQL();
  if (isMySQL) {
    try {
      const db = await getPool();
      const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("MySQL deleteUser failed, using SQLite backup.", err.message);
    }
  }

  // Fallback (SQLite)
  try {
    if (parseInt(id, 10) === 1) {
      throw new Error("Cannot delete primary admin user");
    }
    const db = getBlogDb();
    
    const deleteTx = db.transaction(() => {
      // Delete associated posts
      db.prepare("DELETE FROM posts WHERE author_id = ?").run(id);
      return db.prepare("DELETE FROM users WHERE id = ?").run(id);
    });

    const res = deleteTx();
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite deleteUser failed:", err.message);
    throw err;
  }
}
