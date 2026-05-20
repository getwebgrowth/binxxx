import fs from 'fs';
import path from 'path';
import readline from 'readline';

let isLoaded = false;
let allBanks = [];
let bankToCountryMap = {}; // bankName -> countryName
let countryToBanksMap = {}; // countryName/Code -> Set of banks
let allLevels = [];
let allBrands = [];

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

  if (parts.length < 8) return null;

  const clean = (val) => {
    if (!val) return '';
    return val.replace(/^["']|["']$/g, '').trim();
  };

  return {
    brand: clean(parts[1]),
    level: clean(parts[3]),
    bank: clean(parts[4]),
    country: clean(parts[5]),
    countryCode: clean(parts[6])
  };
}

export async function initFilterData() {
  if (isLoaded) return;

  const dbPath = path.join(process.cwd(), 'src', 'lib', 'bins_unified.csv');
  if (!fs.existsSync(dbPath)) {
    console.error("Unified DB not found at " + dbPath);
    return;
  }

  console.log("Loading filters data into memory cache...");
  const banksSet = new Set();
  const levelsSet = new Set();
  const brandsSet = new Set();

  const fileStream = fs.createReadStream(dbPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const row = parseRow(line);
    if (!row) continue;

    if (row.brand) brandsSet.add(row.brand.toUpperCase());
    if (row.level) levelsSet.add(row.level.toUpperCase());

    if (row.bank) {
      const bankUpper = row.bank.toUpperCase();
      banksSet.add(bankUpper);

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

  allBanks = [...banksSet].sort();
  allLevels = [...levelsSet].sort();
  allBrands = [...brandsSet].sort();
  isLoaded = true;
  console.log(`Loaded filters into memory: ${allBanks.length} banks, ${allLevels.length} levels, ${allBrands.length} brands.`);
}

export async function getSuggestions({ type, search = '', country = '' }) {
  await initFilterData();

  const query = search.toUpperCase().trim();
  const countryQuery = country.toUpperCase().trim();

  if (type === 'bank') {
    let sourceList = allBanks;

    if (countryQuery) {
      const countryBanks = countryToBanksMap[countryQuery];
      if (countryBanks) {
        sourceList = [...countryBanks].sort();
      } else {
        sourceList = [];
      }
    }

    if (!query) {
      return sourceList.slice(0, 100);
    }
    return sourceList.filter(b => b.includes(query)).slice(0, 100);
  }

  if (type === 'level') {
    if (!query) return allLevels.slice(0, 100);
    return allLevels.filter(l => l.includes(query)).slice(0, 100);
  }

  if (type === 'brand') {
    if (!query) return allBrands;
    return allBrands.filter(b => b.includes(query));
  }

  return [];
}
