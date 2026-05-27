const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BINS_CSV = path.join(__dirname, '..', 'lib', 'bins_unified.csv');
const CACHED_CSV = path.join(__dirname, '..', 'lib', 'cached_bins.csv');
const BINS_DB = path.join(__dirname, '..', 'lib', 'bins.db');
const BLOG_DB = path.join(__dirname, '..', 'lib', 'blog.db');
const BLOG_JSON = path.join(__dirname, '..', 'lib', 'db_fallback.json');

// Helper to generate country flag emoji
const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '';
  }
};

const normalize = (str) => (str ? str.toString().toLowerCase().trim() : '');

function parseRow(line) {
  if (!line || line.trim() === '' || line.startsWith('bin,')) {
    return null;
  }

  const parts = [];
  let insideQuote = false;
  let currentPart = '';
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuote = !insideQuote;
    } else if (char === ',' && !insideQuote) {
      parts.push(currentPart);
      currentPart = '';
    } else {
      currentPart += char;
    }
  }
  parts.push(currentPart);

  if (parts.length < 5) return null;

  const clean = (val) => {
    if (!val) return '';
    return val.replace(/^["']|["']$/g, '').trim();
  };

  const bin = clean(parts[0]);
  const brand = clean(parts[1]);
  const type = clean(parts[2]);
  const level = clean(parts[3]);
  const bank = clean(parts[4]);
  const country = clean(parts[5]);
  const countryCode = clean(parts[6]);

  return {
    bin,
    brand,
    type,
    level,
    bank,
    country,
    countryCode,
    flag: clean(parts[7]) || getFlagEmoji(countryCode),
    phone: clean(parts[8] || ''),
    url: clean(parts[9] || '')
  };
}

async function run() {
  console.log("--- STARTING SQLITE DATABASE INITIALIZATION ---");

  // 1. Initialize BINS Database
  console.log(`Creating/opening BINS Database at: ${BINS_DB}`);
  
  // Delete existing database for a clean import
  if (fs.existsSync(BINS_DB)) {
    try {
      fs.unlinkSync(BINS_DB);
      console.log("Deleted old bins.db for clean migration.");
    } catch (e) {
      console.warn("Could not delete old bins.db, will attempt to overwrite rows:", e.message);
    }
  }

  const Database = require('better-sqlite3');
  const binsDb = new Database(BINS_DB);
  binsDb.pragma('journal_mode = WAL');
  binsDb.pragma('synchronous = OFF');

  // Create table
  binsDb.exec(`
    CREATE TABLE IF NOT EXISTS bins (
      bin TEXT PRIMARY KEY,
      brand TEXT,
      type TEXT,
      level TEXT,
      bank TEXT,
      country TEXT,
      countryCode TEXT,
      flag TEXT,
      phone TEXT,
      url TEXT
    );
  `);

  const insertStmt = binsDb.prepare(`
    INSERT OR REPLACE INTO bins (bin, brand, type, level, bank, country, countryCode, flag, phone, url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Transaction wrapper
  const insertBatch = binsDb.transaction((rows) => {
    for (const r of rows) {
      insertStmt.run(r.bin, r.brand, r.type, r.level, r.bank, r.country, r.countryCode, r.flag, r.phone, r.url);
    }
  });

  const processCsvFile = (filePath) => {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}, skipping.`);
        return resolve();
      }

      console.log(`Parsing rows from: ${filePath}...`);
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

      let count = 0;
      let batch = [];
      
      rl.on('line', (line) => {
        const row = parseRow(line);
        if (row && row.bin) {
          batch.push(row);
          count++;

          if (batch.length >= 20000) {
            insertBatch(batch);
            batch = [];
            console.log(`  Inserted ${count} rows so far...`);
          }
        }
      });

      rl.on('close', () => {
        if (batch.length > 0) {
          insertBatch(batch);
        }
        console.log(`Finished importing ${count} rows from ${path.basename(filePath)}.`);
        resolve();
      });

      rl.on('error', (err) => {
        reject(err);
      });
    });
  };

  try {
    await processCsvFile(BINS_CSV);
    await processCsvFile(CACHED_CSV);
    
    console.log("Creating database index on 'bin' column...");
    binsDb.exec(`CREATE INDEX IF NOT EXISTS idx_bins_prefix ON bins(bin);`);
    console.log("Index created successfully.");
  } catch (err) {
    console.error("Failed to import CSVs to SQLite bins.db:", err);
  } finally {
    binsDb.close();
  }

  // 2. Initialize BLOG Database
  console.log(`\nCreating/opening BLOG Database at: ${BLOG_DB}`);
  const blogDb = new Database(BLOG_DB);

  blogDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      tags TEXT DEFAULT '',
      views INTEGER DEFAULT 0,
      author_id INTEGER NOT NULL,
      published_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Seed default admin
  const checkAdmin = blogDb.prepare("SELECT id FROM users WHERE username = ?").get('admin');
  if (!checkAdmin) {
    blogDb.prepare(`
      INSERT INTO users (id, username, password, email, role)
      VALUES (1, 'admin', '749f09bade8aca755660eeb17792da880218d4fbdc4e25fbec279d7fe9f65d70', 'contact@ccbins.co', 'admin')
    `).run();
    console.log("Seeded default admin user.");
  }

  // Seed posts
  const checkPosts = blogDb.prepare("SELECT COUNT(*) as count FROM posts").get();
  if (checkPosts.count === 0) {
    let postsToSeed = [];
    
    // Attempt to seed from db_fallback.json if it exists
    if (fs.existsSync(BLOG_JSON)) {
      try {
        const fallback = JSON.parse(fs.readFileSync(BLOG_JSON, 'utf8'));
        if (fallback.posts && fallback.posts.length > 0) {
          postsToSeed = fallback.posts;
          console.log(`Found ${postsToSeed.length} posts in fallback JSON. Importing...`);
        }

        if (fallback.users) {
          for (const u of fallback.users) {
            if (u.username !== 'admin') {
              blogDb.prepare(`
                INSERT OR IGNORE INTO users (id, username, password, email, role, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
              `).run(u.id, u.username, u.password, u.email, u.role, u.created_at);
            }
          }
        }
      } catch (err) {
        console.warn("Could not read db_fallback.json for seeding, using defaults.", err.message);
      }
    }

    if (postsToSeed.length === 0) {
      postsToSeed = [
        {
          id: 1,
          title: 'Understanding BIN Numbers: The Core of Credit Card Intelligence',
          slug: 'understanding-bin-numbers',
          content: '# Understanding BIN Numbers: The Core of Credit Card Intelligence\n\nBank Identification Numbers (BINs) are the first six to eight digits of a payment card number. They play a critical role in payment processing, fraud prevention, and transaction routing.\n\n## What is a BIN?\n\nA BIN identifies the issuing institution for the card. For example, when a customer swipes a Visa card, the BIN tells the system which bank issued that card and where to send the transaction authorization request.\n\n### Why is BIN Intelligence Important?\n\n1. **Fraud Detection:** Checking if the card country matches the IP country.\n2. **Payment Optimization:** Routing transactions through local networks to save fees.\n3. **Cardholder Insights:** Identifying whether a card is Credit, Debit, Prepaid, Gold, Platinum, etc.',
          summary: 'Learn the fundamentals of Bank Identification Numbers (BINs), why they are critical for merchant payment processing, and how BIN databases optimize routing and reduce fraud.',
          category: 'Fintech',
          tags: 'BIN,Payments,Fraud',
          views: 105,
          author_id: 1,
          published_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'The Future of Payment Security: 3D Secure and Beyond',
          slug: 'future-of-payment-security',
          content: '# The Future of Payment Security: 3D Secure and Beyond\n\nPayment security is evolving rapidly. With the rise of online shopping, secure payment gateways are more critical than ever. In this post, we discuss the implementation of 3D Secure (3DS) and other modern authentication standards.\n\n## Evolution of 3D Secure\n\n3D Secure is a security protocol that adds an extra layer of authentication for online card transactions. Originally developed by Visa (as Verified by Visa), it has evolved into a global standard supported by all major card brands.',
          summary: 'Explore the evolution of payment security, from early 3D Secure protocols to modern risk-based authentication models that optimize merchant checkouts.',
          category: 'Security',
          tags: '3DS,Payments,Compliance',
          views: 48,
          author_id: 1,
          published_at: new Date().toISOString()
        }
      ];
    }

    const insertPost = blogDb.prepare(`
      INSERT INTO posts (id, title, slug, content, summary, category, tags, views, author_id, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of postsToSeed) {
      insertPost.run(
        p.id,
        p.title,
        p.slug,
        p.content,
        p.summary,
        p.category || 'General',
        p.tags || '',
        p.views || 0,
        p.author_id || 1,
        p.published_at || null,
        p.created_at || new Date().toISOString(),
        p.updated_at || new Date().toISOString()
      );
    }
    console.log(`Seeding complete. Seeded ${postsToSeed.length} posts.`);
  }

  blogDb.close();
  console.log("--- SQLITE INITIALIZATION FINISHED SUCCESSFULLY ---");
}

run();
