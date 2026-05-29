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
      
      // Auto-create user bookmarks, lists, and collections tables
      blogDb.exec(`
        CREATE TABLE IF NOT EXISTS saved_bins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          bin TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE (user_id, bin)
        );

        CREATE TABLE IF NOT EXISTS bin_lists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          is_private INTEGER DEFAULT 1,
          share_token TEXT UNIQUE,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS bin_list_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          list_id INTEGER NOT NULL,
          bin TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (list_id) REFERENCES bin_lists(id) ON DELETE CASCADE,
          UNIQUE (list_id, bin)
        );

        CREATE TABLE IF NOT EXISTS bookmarks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          list_id INTEGER NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (list_id) REFERENCES bin_lists(id) ON DELETE CASCADE,
          UNIQUE (user_id, list_id)
        );

        CREATE TABLE IF NOT EXISTS list_reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          list_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          rating INTEGER NOT NULL DEFAULT 5,
          comment TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (list_id) REFERENCES bin_lists(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE (list_id, user_id)
        );
      `);

      // Migrate: add share_token column if it doesn't exist yet (idempotent)
      try {
        blogDb.exec(`ALTER TABLE bin_lists ADD COLUMN share_token TEXT UNIQUE`);
      } catch (_) { /* column already exists */ }

      // Migrate: add bin_reviews table
      blogDb.exec(`
        CREATE TABLE IF NOT EXISTS bin_reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bin TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          username TEXT NOT NULL,
          rating INTEGER NOT NULL DEFAULT 5 CHECK(rating BETWEEN 1 AND 5),
          comment TEXT DEFAULT '',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_bin_reviews_bin ON bin_reviews(bin);
        CREATE INDEX IF NOT EXISTS idx_bin_reviews_user ON bin_reviews(user_id);
      `);
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

// ==========================================
// USER DASHBOARD HELPER OPERATIONS
// ==========================================

export async function getSavedBins(userId) {
  try {
    const db = getBlogDb();
    // Retrieve metadata for each saved BIN if it exists in the bins database
    // Note: bins database is bins.db, but blog.db has the association. Let's do a cross-db attach or simply query blog.db
    // and let the client fetch info if needed, or query both.
    const query = `
      SELECT sb.bin, sb.created_at
      FROM saved_bins sb
      WHERE sb.user_id = ?
      ORDER BY sb.created_at DESC
    `;
    const rows = db.prepare(query).all(userId);
    
    // Attach details from bins.db if available
    try {
      const path = require('path');
      const Database = require('better-sqlite3');
      const binsDb = new Database(path.join(process.cwd(), 'src', 'lib', 'bins.db'));
      const stmt = binsDb.prepare('SELECT brand, type, level, bank, country, countryCode, flag FROM bins WHERE bin = ? LIMIT 1');
      for (const row of rows) {
        const info = stmt.get(row.bin.substring(0, 8)) || stmt.get(row.bin.substring(0, 6));
        if (info) {
          Object.assign(row, info);
        }
      }
      binsDb.close();
    } catch (e) {
      console.warn("Could not query bins.db for bookmark details:", e.message);
    }
    
    return rows;
  } catch (err) {
    console.error("SQLite getSavedBins failed:", err.message);
    return [];
  }
}

export async function saveBin(userId, bin) {
  try {
    const db = getBlogDb();
    const res = db.prepare("INSERT OR IGNORE INTO saved_bins (user_id, bin) VALUES (?, ?)")
      .run(userId, bin);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite saveBin failed:", err.message);
    return false;
  }
}

export async function unsaveBin(userId, bin) {
  try {
    const db = getBlogDb();
    const res = db.prepare("DELETE FROM saved_bins WHERE user_id = ? AND bin = ?")
      .run(userId, bin);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite unsaveBin failed:", err.message);
    return false;
  }
}

export async function isBinSaved(userId, bin) {
  try {
    const db = getBlogDb();
    const row = db.prepare("SELECT id FROM saved_bins WHERE user_id = ? AND bin = ? LIMIT 1")
      .get(userId, bin);
    return !!row;
  } catch (err) {
    console.error("SQLite isBinSaved failed:", err.message);
    return false;
  }
}

export async function getBinLists(userId) {
  try {
    const db = getBlogDb();
    const query = `
      SELECT bl.*, (SELECT COUNT(*) FROM bin_list_items WHERE list_id = bl.id) as item_count
      FROM bin_lists bl
      WHERE bl.user_id = ?
      ORDER BY bl.created_at DESC
    `;
    return db.prepare(query).all(userId);
  } catch (err) {
    console.error("SQLite getBinLists failed:", err.message);
    return [];
  }
}

export async function createBinList(userId, name, description, isPrivate = 1) {
  try {
    const db = getBlogDb();
    // Generate share token for public lists
    let shareToken = null;
    if (!isPrivate) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      let token; let attempts = 0;
      do {
        token = Array.from({ length: 8 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        attempts++;
      } while (db.prepare('SELECT id FROM bin_lists WHERE share_token = ?').get(token) && attempts < 10);
      shareToken = token;
    }
    const res = db.prepare("INSERT INTO bin_lists (user_id, name, description, is_private, share_token) VALUES (?, ?, ?, ?, ?)")
      .run(userId, name, description, isPrivate ? 1 : 0, shareToken);
    return res.lastInsertRowid;
  } catch (err) {
    console.error("SQLite createBinList failed:", err.message);
    throw err;
  }
}

export async function deleteBinList(userId, listId) {
  try {
    const db = getBlogDb();
    const res = db.prepare("DELETE FROM bin_lists WHERE user_id = ? AND id = ?")
      .run(userId, listId);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite deleteBinList failed:", err.message);
    return false;
  }
}

export async function getBinListItems(listId) {
  try {
    const db = getBlogDb();
    const rows = db.prepare("SELECT bin, created_at FROM bin_list_items WHERE list_id = ?").all(listId);
    
    // Attach details from bins.db if available
    try {
      const path = require('path');
      const Database = require('better-sqlite3');
      const binsDb = new Database(path.join(process.cwd(), 'src', 'lib', 'bins.db'));
      const stmt = binsDb.prepare('SELECT brand, type, level, bank, country, countryCode, flag FROM bins WHERE bin = ? LIMIT 1');
      for (const row of rows) {
        const info = stmt.get(row.bin.substring(0, 8)) || stmt.get(row.bin.substring(0, 6));
        if (info) {
          Object.assign(row, info);
        }
      }
      binsDb.close();
    } catch (e) {
      console.warn("Could not query bins.db for list item details:", e.message);
    }
    
    return rows;
  } catch (err) {
    console.error("SQLite getBinListItems failed:", err.message);
    return [];
  }
}

export async function addBinToList(listId, bin) {
  try {
    const db = getBlogDb();
    const res = db.prepare("INSERT OR IGNORE INTO bin_list_items (list_id, bin) VALUES (?, ?)")
      .run(listId, bin);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite addBinToList failed:", err.message);
    return false;
  }
}

export async function removeBinFromList(listId, bin) {
  try {
    const db = getBlogDb();
    const res = db.prepare("DELETE FROM bin_list_items WHERE list_id = ? AND bin = ?")
      .run(listId, bin);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite removeBinFromList failed:", err.message);
    return false;
  }
}

export async function getBookmarks(userId) {
  try {
    const db = getBlogDb();
    const query = `
      SELECT bm.id as bookmark_id, bm.created_at as bookmarked_at, bl.*, u.username as owner_name,
             (SELECT COUNT(*) FROM bin_list_items WHERE list_id = bl.id) as item_count
      FROM bookmarks bm
      JOIN bin_lists bl ON bm.list_id = bl.id
      JOIN users u ON bl.user_id = u.id
      WHERE bm.user_id = ?
      ORDER BY bm.created_at DESC
    `;
    return db.prepare(query).all(userId);
  } catch (err) {
    console.error("SQLite getBookmarks failed:", err.message);
    return [];
  }
}

export async function addBookmark(userId, listId) {
  try {
    const db = getBlogDb();
    const res = db.prepare("INSERT OR IGNORE INTO bookmarks (user_id, list_id) VALUES (?, ?)")
      .run(userId, listId);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite addBookmark failed:", err.message);
    return false;
  }
}

export async function removeBookmark(userId, listId) {
  try {
    const db = getBlogDb();
    const res = db.prepare("DELETE FROM bookmarks WHERE user_id = ? AND list_id = ?")
      .run(userId, listId);
    return res.changes > 0;
  } catch (err) {
    console.error("SQLite removeBookmark failed:", err.message);
    return false;
  }
}

// ==========================================
// PUBLIC LIST / PROFILE / REVIEW OPERATIONS
// ==========================================

/**
 * Generate an 8-character alphanumeric share token
 */
function generateShareToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Ensure a bin_list has a share_token. Generates one if missing.
 */
export async function ensureShareToken(listId) {
  try {
    const db = getBlogDb();
    const existing = db.prepare('SELECT share_token FROM bin_lists WHERE id = ?').get(listId);
    if (existing?.share_token) return existing.share_token;
    // Generate unique token
    let token;
    let attempts = 0;
    do {
      token = generateShareToken();
      attempts++;
    } while (db.prepare('SELECT id FROM bin_lists WHERE share_token = ?').get(token) && attempts < 10);
    db.prepare('UPDATE bin_lists SET share_token = ? WHERE id = ?').run(token, listId);
    return token;
  } catch (err) {
    console.error('ensureShareToken failed:', err.message);
    return null;
  }
}

/**
 * Fetch a public list (and its items) by share_token.
 * Returns { list, items } or null if not found.
 */
export async function getPublicListByToken(token) {
  try {
    const db = getBlogDb();
    const list = db.prepare(`
      SELECT bl.*, u.username as owner_name,
        (SELECT COUNT(*) FROM bin_list_items WHERE list_id = bl.id) as item_count
      FROM bin_lists bl
      JOIN users u ON bl.user_id = u.id
      WHERE bl.share_token = ?
      LIMIT 1
    `).get(token);
    if (!list) return null;

    // Fetch items
    const rows = db.prepare('SELECT bin, created_at FROM bin_list_items WHERE list_id = ? ORDER BY created_at DESC').all(list.id);

    // Enrich from bins.db
    try {
      const path = require('path');
      const Database = require('better-sqlite3');
      const binsDb = new Database(path.join(process.cwd(), 'src', 'lib', 'bins.db'));
      const stmt = binsDb.prepare('SELECT brand, type, level, bank, country, countryCode, flag FROM bins WHERE bin = ? LIMIT 1');
      for (const row of rows) {
        const info = stmt.get(row.bin.substring(0, 8)) || stmt.get(row.bin.substring(0, 6));
        if (info) Object.assign(row, info);
      }
      binsDb.close();
    } catch (_) { /* bins.db unavailable */ }

    return { list, items: rows };
  } catch (err) {
    console.error('getPublicListByToken failed:', err.message);
    return null;
  }
}

/**
 * Get public profile info for a username.
 */
export async function getUserProfile(username) {
  try {
    const db = getBlogDb();
    const user = db.prepare(
      'SELECT id, username, created_at FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1'
    ).get(username);
    if (!user) return null;
    const listCount = db.prepare(
      'SELECT COUNT(*) as cnt FROM bin_lists WHERE user_id = ? AND is_private = 0'
    ).get(user.id)?.cnt || 0;
    const binCount = db.prepare(`
      SELECT COUNT(*) as cnt FROM bin_list_items bli
      JOIN bin_lists bl ON bl.id = bli.list_id
      WHERE bl.user_id = ? AND bl.is_private = 0
    `).get(user.id)?.cnt || 0;
    return { ...user, public_list_count: listCount, public_bin_count: binCount };
  } catch (err) {
    console.error('getUserProfile failed:', err.message);
    return null;
  }
}

/**
 * Get all public lists for a user (with share_token auto-created).
 */
export async function getPublicListsByUser(username) {
  try {
    const db = getBlogDb();
    const user = db.prepare(
      'SELECT id FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1'
    ).get(username);
    if (!user) return [];
    const lists = db.prepare(`
      SELECT bl.*,
        (SELECT COUNT(*) FROM bin_list_items WHERE list_id = bl.id) as item_count
      FROM bin_lists bl
      WHERE bl.user_id = ? AND bl.is_private = 0
      ORDER BY bl.created_at DESC
    `).all(user.id);
    // Ensure each public list has a share_token
    for (const list of lists) {
      if (!list.share_token) {
        list.share_token = await ensureShareToken(list.id);
      }
    }
    return lists;
  } catch (err) {
    console.error('getPublicListsByUser failed:', err.message);
    return [];
  }
}

/**
 * Get reviews for a list.
 */
export async function getListReviews(listId) {
  try {
    const db = getBlogDb();
    return db.prepare(`
      SELECT lr.*, u.username
      FROM list_reviews lr
      JOIN users u ON lr.user_id = u.id
      WHERE lr.list_id = ?
      ORDER BY lr.created_at DESC
    `).all(listId);
  } catch (err) {
    console.error('getListReviews failed:', err.message);
    return [];
  }
}

/**
 * Add or update a review for a list (upsert).
 */
export async function upsertListReview(userId, listId, rating, comment) {
  try {
    const db = getBlogDb();
    db.prepare(`
      INSERT INTO list_reviews (list_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(list_id, user_id) DO UPDATE SET rating = excluded.rating, comment = excluded.comment, created_at = CURRENT_TIMESTAMP
    `).run(listId, userId, rating, comment || '');
    return true;
  } catch (err) {
    console.error('upsertListReview failed:', err.message);
    return false;
  }
}

// ==========================================
// BIN REVIEWS (per-BIN community reviews)
// ==========================================

/**
 * Add or update a review for a BIN prefix.
 */
export async function upsertBinReview(userId, username, bin, rating, comment) {
  try {
    const db = getBlogDb();
    // Allow multiple reviews per user per bin (append-only) - no upsert
    db.prepare(`
      INSERT INTO bin_reviews (bin, user_id, username, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(bin, userId, username, rating, comment || '');
    return true;
  } catch (err) {
    console.error('upsertBinReview failed:', err.message);
    return false;
  }
}

/**
 * Get all reviews for a specific BIN, paginated.
 */
export async function getBinReviews(bin, page = 1, perPage = 9) {
  try {
    const db = getBlogDb();
    const offset = (page - 1) * perPage;
    const rows = db.prepare(`
      SELECT id, bin, username, rating, comment, created_at
      FROM bin_reviews
      WHERE bin = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(bin, perPage, offset);
    const total = db.prepare('SELECT COUNT(*) as cnt FROM bin_reviews WHERE bin = ?').get(bin)?.cnt || 0;
    const avg = db.prepare('SELECT AVG(rating) as avg FROM bin_reviews WHERE bin = ?').get(bin)?.avg || null;
    return { reviews: rows, total, totalPages: Math.ceil(total / perPage), avg: avg ? avg.toFixed(1) : null };
  } catch (err) {
    console.error('getBinReviews failed:', err.message);
    return { reviews: [], total: 0, totalPages: 1, avg: null };
  }
}

/**
 * Get all reviews by a specific user (for their profile / my-bins tab).
 */
export async function getUserBinReviews(userId) {
  try {
    const db = getBlogDb();
    return db.prepare(`
      SELECT id, bin, rating, comment, created_at
      FROM bin_reviews
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(userId);
  } catch (err) {
    console.error('getUserBinReviews failed:', err.message);
    return [];
  }
}

/**
 * Get top reviewers ranked by number of BIN reviews.
 */
export async function getTopBinReviewers(limit = 6) {
  try {
    const db = getBlogDb();
    return db.prepare(`
      SELECT username, COUNT(*) as review_count, AVG(rating) as avg_rating
      FROM bin_reviews
      GROUP BY username
      ORDER BY review_count DESC
      LIMIT ?
    `).all(limit);
  } catch (err) {
    console.error('getTopBinReviewers failed:', err.message);
    return [];
  }
}

/**
 * Get most reviewed BINs.
 */
export async function getMostReviewedBins(limit = 6) {
  try {
    const db = getBlogDb();
    return db.prepare(`
      SELECT bin, COUNT(*) as review_count, AVG(rating) as avg_rating
      FROM bin_reviews
      GROUP BY bin
      ORDER BY review_count DESC
      LIMIT ?
    `).all(limit);
  } catch (err) {
    console.error('getMostReviewedBins failed:', err.message);
    return [];
  }
}

/**
 * Get recent BIN reviews across all BINs.
 */
export async function getRecentBinReviews(limit = 9) {
  try {
    const db = getBlogDb();
    return db.prepare(`
      SELECT id, bin, username, rating, comment, created_at
      FROM bin_reviews
      ORDER BY created_at DESC
      LIMIT ?
    `).all(limit);
  } catch (err) {
    console.error('getRecentBinReviews failed:', err.message);
    return [];
  }
}
