import { initDb, allBanksSet, allLevelsSet, allBrandsSet, countryToBanksMap } from './db';

let allBanks = [];
let allLevels = [];
let allBrands = [];
let isSorted = false;

async function ensureData() {
  await initDb();
  if (!isSorted) {
    allBanks = [...allBanksSet].sort();
    allLevels = [...allLevelsSet].sort();
    allBrands = [...allBrandsSet].sort();
    isSorted = true;
  }
}

export async function getSuggestions({ type, search = '', country = '' }) {
  await ensureData();

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
