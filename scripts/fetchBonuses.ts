/**
 * Script to fetch bonuses from QBReader API and store them in Firestore
 * Run with: npm run fetch-data
 */

import type { Bonus, QBReaderQueryResponse } from '../types/quizbowl';

const API_BASE_URL = 'https://www.qbreader.org/api';

// Common quizbowl categories
const CATEGORIES = [
  'Literature',
  'History',
  'Science',
  'Fine Arts',
  'Religion',
  'Mythology',
  'Philosophy',
  'Social Science',
  'Current Events',
  'Geography',
  'Other Academic',
  'Pop Culture',
];

interface FetchOptions {
  category?: string;
  subcategory?: string;
  maxReturnLength?: number;
  minYear?: number;
  maxYear?: number;
}

/**
 * Fetch bonuses from QBReader API
 */
async function fetchBonuses(options: FetchOptions = {}): Promise<Bonus[]> {
  const {
    category,
    subcategory,
    maxReturnLength = 1000,
    minYear = 2010,
    maxYear = new Date().getFullYear(),
  } = options;

  const params = new URLSearchParams({
    questionType: 'bonus',
    maxReturnLength: maxReturnLength.toString(),
    minYear: minYear.toString(),
    maxYear: maxYear.toString(),
  });

  if (category) {
    params.append('categories', category);
  }

  if (subcategory) {
    params.append('subcategories', subcategory);
  }

  const url = `${API_BASE_URL}/query?${params.toString()}`;

  console.log(`Fetching bonuses for category: ${category || 'all'}...`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: QBReaderQueryResponse = await response.json();
    console.log(`Fetched ${data.bonuses.count} bonuses`);

    return data.bonuses.questionArray;
  } catch (error) {
    console.error(`Error fetching bonuses:`, error);
    return [];
  }
}

/**
 * Fetch bonuses for all categories with rate limiting
 */
async function fetchAllBonuses(): Promise<Map<string, Bonus[]>> {
  const allBonuses = new Map<string, Bonus[]>();

  // Rate limit: 20 requests per second, so we'll wait 100ms between requests
  const RATE_LIMIT_DELAY = 100;

  for (const category of CATEGORIES) {
    const bonuses = await fetchBonuses({ category, maxReturnLength: 1000 });
    allBonuses.set(category, bonuses);

    // Wait to respect rate limit
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
  }

  return allBonuses;
}

/**
 * Save bonuses to a JSON file (for now, before Firebase is set up)
 */
async function saveBonusesToFile(bonusesMap: Map<string, Bonus[]>) {
  const fs = await import('fs/promises');
  const path = await import('path');

  const dataDir = path.join(process.cwd(), 'data');

  // Create data directory if it doesn't exist
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  // Save each category to a separate file
  for (const [category, bonuses] of bonusesMap.entries()) {
    const fileName = `${category.toLowerCase().replace(/\s+/g, '-')}.json`;
    const filePath = path.join(dataDir, fileName);

    await fs.writeFile(filePath, JSON.stringify(bonuses, null, 2));
    console.log(`Saved ${bonuses.length} bonuses to ${fileName}`);
  }

  // Also save a summary file
  const summary = {
    totalCategories: bonusesMap.size,
    categories: Array.from(bonusesMap.entries()).map(([category, bonuses]) => ({
      category,
      count: bonuses.length,
    })),
    totalBonuses: Array.from(bonusesMap.values()).reduce(
      (sum, bonuses) => sum + bonuses.length,
      0
    ),
    fetchedAt: new Date().toISOString(),
  };

  await fs.writeFile(
    path.join(dataDir, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n=== Summary ===');
  console.log(`Total categories: ${summary.totalCategories}`);
  console.log(`Total bonuses: ${summary.totalBonuses}`);
  console.log('\nBonuses by category:');
  summary.categories.forEach(({ category, count }) => {
    console.log(`  ${category}: ${count}`);
  });
}

/**
 * Main function
 */
async function main() {
  console.log('Starting bonus fetch from QBReader...\n');

  const bonusesMap = await fetchAllBonuses();
  await saveBonusesToFile(bonusesMap);

  console.log('\nDone! Bonuses saved to data/ directory');
}

// Run the script
main().catch(console.error);
