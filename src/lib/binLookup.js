import fs from 'fs';
import path from 'path';
import { getDb, initDb, getFlagEmoji, CACHED_DB_PATH } from './db';

const normalize = (str) => (str ? str.toString().toLowerCase().trim() : '');

const inflightFetches = new Map();

function matchesFilters(row, normFilters) {
  if (!normFilters) return true;
  
  const rowBrandNorm = normalize(row.brand);
  const rowTypeNorm = normalize(row.type);
  const rowLevelNorm = normalize(row.level);
  const rowBankNorm = normalize(row.bank);
  const rowCountryNorm = normalize(row.country);
  const rowCountryCodeNorm = normalize(row.countryCode);

  if (normFilters.brand && rowBrandNorm !== normFilters.brand) return false;
  if (normFilters.type && rowTypeNorm !== normFilters.type) return false;
  
  if (normFilters.level && normFilters.level.length > 0) {
    if (!normFilters.level.includes(rowLevelNorm)) return false;
  }
  
  if (normFilters.bank && !rowBankNorm.includes(normFilters.bank)) return false;
  
  if (normFilters.country) {
    if (rowCountryNorm !== normFilters.country && rowCountryCodeNorm !== normFilters.country) return false;
  }
  
  return true;
}

export async function lookupBins(bins, filters, limit = 100) {
  await initDb();
  const db = getDb();
  
  const results = [];
  const searchBins = new Set((bins || []).map(b => b.toString().substring(0, 6))); // match first 6
  const isBulk = searchBins.size > 0;
  
  const normFilters = filters ? {
    brand: normalize(filters.brand),
    type: normalize(filters.type),
    level: Array.isArray(filters.level)
      ? filters.level.map(l => normalize(l)).filter(Boolean)
      : filters.level ? [normalize(filters.level)] : [],
    bank: normalize(filters.bank),
    country: normalize(filters.country)
  } : null;

  const hasActiveFilters = normFilters && (
    normFilters.brand ||
    normFilters.type ||
    (normFilters.level && normFilters.level.length > 0) ||
    normFilters.bank ||
    normFilters.country
  );

  if (!isBulk && !hasActiveFilters) {
    return [];
  }

  if (isBulk) {
    // Query database for requested BINs
    const searchBinsArr = Array.from(searchBins);
    const placeholders = searchBinsArr.map(() => '?').join(',');
    const query = `SELECT * FROM bins WHERE bin IN (${placeholders})`;
    
    try {
      const rows = db.prepare(query).all(...searchBinsArr);
      for (const row of rows) {
        if (matchesFilters(row, normFilters)) {
          results.push(row);
        }
      }
    } catch (err) {
      console.error("SQLite bulk query failed:", err);
    }
    
    // Fill remaining missing bins as Not Found or Fetch from API
    const foundBins = new Set(results.map(r => r.bin.substring(0, 6)));
    for (const notFoundBin of searchBins) {
      if (!foundBins.has(notFoundBin)) {
        if (bins.length === 1) {
          const binToSearch = bins[0];
          const apiResult = await fetchFromApi(binToSearch);
          if (apiResult) {
            if (matchesFilters(apiResult, normFilters)) {
              results.push(apiResult);
              continue;
            }
          }
        }
        results.push({ bin: notFoundBin, error: "Not found" });
      }
    }
  } else {
    // Query database with active filters
    let query = "SELECT * FROM bins WHERE 1=1";
    const params = [];
    
    if (normFilters.brand) {
      query += " AND LOWER(brand) = ?";
      params.push(normFilters.brand);
    }
    if (normFilters.type) {
      query += " AND LOWER(type) = ?";
      params.push(normFilters.type);
    }
    if (normFilters.level && normFilters.level.length > 0) {
      const placeholders = normFilters.level.map(() => '?').join(',');
      query += ` AND LOWER(level) IN (${placeholders})`;
      normFilters.level.forEach(l => params.push(l));
    }
    if (normFilters.bank) {
      query += " AND LOWER(bank) LIKE ?";
      params.push(`%${normFilters.bank}%`);
    }
    if (normFilters.country) {
      query += " AND (LOWER(country) = ? OR LOWER(countryCode) = ?)";
      params.push(normFilters.country, normFilters.country);
    }
    
    query += " LIMIT ?";
    params.push(limit);

    try {
      const rows = db.prepare(query).all(...params);
      results.push(...rows);
    } catch (err) {
      console.error("SQLite filter query failed:", err);
    }
  }

  return results;
}

async function fetchFromApi(bin) {
  const bin6 = bin.substring(0, 6);
  const db = getDb();

  // Double check SQLite first
  try {
    const existing = db.prepare("SELECT * FROM bins WHERE bin = ?").get(bin6);
    if (existing) {
      return existing;
    }
  } catch (err) {
    console.error("SQLite check in fetchFromApi failed:", err);
  }

  if (inflightFetches.has(bin6)) {
    return inflightFetches.get(bin6);
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(`https://lookup.binlist.net/${bin}`, {
        headers: { "Accept-Version": "3" }
      });
      if (!res.ok) return null;
      const data = await res.json();
      
      const row = {
        bin: bin,
        brand: data.scheme || '',
        type: data.type || '',
        level: data.brand || '',
        bank: (data.bank && data.bank.name) || '',
        country: (data.country && data.country.name) || '',
        countryCode: (data.country && data.country.alpha2) || '',
        flag: (data.country && data.country.emoji) || getFlagEmoji((data.country && data.country.alpha2) || ''),
        phone: (data.bank && data.bank.phone) || '',
        url: (data.bank && data.bank.url) || ''
      };

      // Write to SQLite and CSV cache
      try {
        const existing = db.prepare("SELECT bin FROM bins WHERE bin = ?").get(bin6);
        if (!existing) {
          // 1. Insert into bins.db SQLite database
          db.prepare(`
            INSERT INTO bins (bin, brand, type, level, bank, country, countryCode, flag, phone, url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(row.bin, row.brand, row.type, row.level, row.bank, row.country, row.countryCode, row.flag, row.phone, row.url);

          // 2. Append to cached_bins.csv as text backup
          const cacheLine = `${row.bin},${row.brand},${row.type},${row.level},${row.bank},${row.country},${row.countryCode},${row.flag},${row.phone},${row.url}\n`;
          fs.appendFileSync(CACHED_DB_PATH, cacheLine);
        }
      } catch (dbErr) {
        console.error("Failed to write resolved API bin to SQLite/CSV:", dbErr);
      }

      return row;
    } catch (err) {
      console.error("API error", err);
      return null;
    }
  })();

  inflightFetches.set(bin6, fetchPromise);

  try {
    const result = await fetchPromise;
    return result;
  } finally {
    inflightFetches.delete(bin6);
  }
}
