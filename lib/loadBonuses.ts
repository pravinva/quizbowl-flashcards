/**
 * Utility functions for loading bonus data
 */

import type { Bonus, CategoryInfo } from '@/types/quizbowl';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Get available categories from the data directory
 */
export async function getCategories(): Promise<CategoryInfo[]> {
  try {
    const summaryPath = path.join(DATA_DIR, 'summary.json');
    const summaryContent = await fs.readFile(summaryPath, 'utf-8');
    const summary = JSON.parse(summaryContent);

    return summary.categories.map((cat: any) => ({
      id: cat.category.toLowerCase().replace(/\s+/g, '-'),
      name: cat.category,
      count: cat.count,
    }));
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

/**
 * Transform QBReader bonus format to our internal format
 */
function transformBonus(rawBonus: any): Bonus {
  // Some bonuses from QBReader may be missing values, answers, or other fields
  // We need to handle these cases gracefully
  const partsCount = Array.isArray(rawBonus.parts) ? rawBonus.parts.length : 0;

  return {
    ...rawBonus,
    parts: Array.from({ length: partsCount }, (_, index) => ({
      question: rawBonus.parts?.[index] || '',
      answer: rawBonus.answers?.[index] || 'Answer not available',
      value: rawBonus.values?.[index] || 10, // Default to 10 points if missing
      difficultyModifier: rawBonus.difficultyModifiers?.[index],
    })),
  };
}

/**
 * Load bonuses for a specific category
 */
export async function loadBonusesByCategory(
  categoryId: string
): Promise<Bonus[]> {
  try {
    const fileName = `${categoryId}.json`;
    const filePath = path.join(DATA_DIR, fileName);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rawBonuses = JSON.parse(fileContent);

    // Transform the raw QBReader format to our expected format
    return rawBonuses.map(transformBonus);
  } catch (error) {
    console.error(`Error loading bonuses for category ${categoryId}:`, error);
    return [];
  }
}

/**
 * Check if data directory exists and has data
 */
export async function hasData(): Promise<boolean> {
  try {
    await fs.access(DATA_DIR);
    const summaryPath = path.join(DATA_DIR, 'summary.json');
    await fs.access(summaryPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a random subset of bonuses
 */
export function getRandomBonuses(bonuses: Bonus[], count: number): Bonus[] {
  const shuffled = [...bonuses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
