const Database = require('better-sqlite3');
const path = require('path');

const BINS_DB_PATH = path.join(process.cwd(), 'src', 'lib', 'bins.db');
export const CACHED_DB_PATH = path.join(process.cwd(), 'src', 'lib', 'cached_bins.csv');

let db = null;
let isLoaded = false;
let loadPromise = null;

// Fake array object to prevent breaking any legacy references
export const dbRows = { length: 0 };
export const dbBinMap = new Map(); // Kept for legacy compatibility if referenced

export const allBanksSet = new Set();
export const allLevelsSet = new Set();
export const allBrandsSet = new Set();
export const countryToBanksMap = {};

export function getDb() {
  if (!db) {
    db = new Database(BINS_DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = OFF');
  }
  return db;
}

export function initDb() {
  if (isLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    try {
      console.log("Initializing SQLite DB interface...");
      const conn = getDb();
      
      // Get count
      const countRes = conn.prepare("SELECT COUNT(*) as count FROM bins").get();
      dbRows.length = countRes.count;

      // Load lists of unique vendors, levels, and banks for suggestions dropdown
      console.log("Pre-loading SQLite indexes for filter dropdowns...");
      const rows = conn.prepare("SELECT DISTINCT brand, level, bank, country, countryCode FROM bins").all();
      
      for (const row of rows) {
        if (row.brand) allBrandsSet.add(row.brand.toUpperCase());
        if (row.level) allLevelsSet.add(row.level.toUpperCase());
        
        if (row.bank) {
          const bankUpper = row.bank.toUpperCase();
          allBanksSet.add(bankUpper);
          
          if (row.country) {
            const countryUpper = row.country.toUpperCase();
            if (!countryToBanksMap[countryUpper]) {
              countryToBanksMap[countryUpper] = new Set();
            }
            countryToBanksMap[countryUpper].add(bankUpper);
          }
          
          if (row.countryCode) {
            const codeUpper = row.countryCode.toUpperCase();
            if (!countryToBanksMap[codeUpper]) {
              countryToBanksMap[codeUpper] = new Set();
            }
            countryToBanksMap[codeUpper].add(bankUpper);
          }
        }
      }

      isLoaded = true;
      console.log(`SQLite DB interface loaded. Rows in database: ${dbRows.length}`);
      resolve();
    } catch (e) {
      console.error("Failed to initialize SQLite db.js:", e);
      resolve();
    }
  });

  return loadPromise;
}

// Helper to generate country flag emoji
export function getFlagEmoji(countryCode) {
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
}
