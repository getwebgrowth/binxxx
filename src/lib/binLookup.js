import fs from 'fs';
import readline from 'readline';
import path from 'path';

const UNIFIED_DB_PATH = path.join(process.cwd(), 'src', 'lib', 'bins_unified.csv');
const CACHED_DB_PATH = path.join('/tmp', 'cached_bins.csv');

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

const normalize = (str) => (str ? str.toString().toLowerCase().trim() : '');

// Fast CSV parsing that handles quotes
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

  // Columns: bin,brand,type,level,bank,country,countryCode,flag,phone,url
  return {
    bin: clean(parts[0]),
    brand: clean(parts[1]),
    type: clean(parts[2]),
    level: clean(parts[3]),
    bank: clean(parts[4]),
    country: clean(parts[5]),
    countryCode: clean(parts[6]),
    flag: clean(parts[7]) || getFlagEmoji(clean(parts[6])),
    phone: clean(parts[8]),
    url: clean(parts[9])
  };
}

function matchesFilters(row, filters) {
  if (!filters) return true;
  if (filters.brand && normalize(row.brand) !== normalize(filters.brand)) return false;
  if (filters.type && normalize(row.type) !== normalize(filters.type)) return false;
  
  if (filters.level) {
    if (Array.isArray(filters.level)) {
      if (filters.level.length > 0 && !filters.level.map(l => normalize(l)).includes(normalize(row.level))) return false;
    } else if (normalize(row.level) !== normalize(filters.level)) {
      return false;
    }
  }
  
  if (filters.bank && !normalize(row.bank).includes(normalize(filters.bank))) return false;
  
  if (filters.country) {
    const normCountry = normalize(filters.country);
    if (normalize(row.country) !== normCountry && normalize(row.countryCode) !== normCountry) return false;
  }
  
  return true;
}


export async function lookupBins(bins, filters, limit = 100) {
  const results = [];
  const searchBins = new Set((bins || []).map(b => b.toString().substring(0, 6))); // match first 6
  const isBulk = searchBins.size > 0;
  
  if (!isBulk && (!filters || Object.values(filters).every(v => !v))) {
    return [];
  }

  // 1. Check in cached_bins.csv first (fastest)
  if (fs.existsSync(CACHED_DB_PATH)) {
    const fileStream = fs.createReadStream(CACHED_DB_PATH);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      const row = parseRow(line);
      if (!row || !row.bin) continue;
      const rowBin6 = row.bin.substring(0, 6);

      if (isBulk) {
        if (searchBins.has(rowBin6) && matchesFilters(row, filters)) {
          results.push(row);
          searchBins.delete(rowBin6);
        }
      } else {
        if (matchesFilters(row, filters)) {
          results.push(row);
        }
      }
    }
    if (isBulk && searchBins.size === 0) return results;
  }

  // 2. Check in bins_unified.csv
  if (fs.existsSync(UNIFIED_DB_PATH)) {
    const fileStream = fs.createReadStream(UNIFIED_DB_PATH);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      if (results.length >= limit && !isBulk) {
        rl.close();
        break;
      }

      const row = parseRow(line);
      if (!row || !row.bin) continue;
      const rowBin6 = row.bin.substring(0, 6);

      if (isBulk) {
        if (searchBins.has(rowBin6)) {
          if (matchesFilters(row, filters)) {
            results.push(row);
            searchBins.delete(rowBin6);
          }
        }
      } else {
        if (matchesFilters(row, filters)) {
          results.push(row);
        }
      }
    }
  }

  // 3. Fallback to API for single BIN query if not found in cache or database
  if (isBulk && bins.length === 1 && searchBins.size > 0) {
    const binToSearch = bins[0];
    const apiResult = await fetchFromApi(binToSearch);
    if (apiResult) {
      if (matchesFilters(apiResult, filters)) {
        results.push(apiResult);
      }
    } else {
      results.push({ bin: binToSearch, error: "Not found in DB or API" });
    }
  } else {
    // Fill remaining missing bins as Not Found
    for (const notFoundBin of searchBins) {
      results.push({ bin: notFoundBin, error: "Not found" });
    }
  }

  return results;
}

async function fetchFromApi(bin) {
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
      bank: data.bank ? data.bank.name : '',
      country: data.country ? data.country.name : '',
      countryCode: data.country ? data.country.alpha2 : '',
      flag: data.country ? data.country.emoji : getFlagEmoji(data.country ? data.country.alpha2 : ''),
      phone: data.bank ? data.bank.phone : '',
      url: data.bank ? data.bank.url : ''
    };

    // Cache it!
    const cacheLine = `\n${row.bin},${row.brand},${row.type},${row.level},${row.bank},${row.country},${row.countryCode},${row.flag},${row.phone},${row.url}`;
    fs.appendFileSync(CACHED_DB_PATH, cacheLine);

    return row;
  } catch (err) {
    console.error("API error", err);
    return null;
  }
}
