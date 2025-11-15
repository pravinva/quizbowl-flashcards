import { NextRequest, NextResponse } from 'next/server';
import { loadBonusesByCategory } from '@/lib/loadBonuses';
import type { Bonus } from '@/types/quizbowl';

// Helper to create searchable text from a bonus
function createBonusText(bonus: Bonus): string {
  const parts = bonus.parts?.map(p => `${p.question} ${p.answer}`).join(' ') || '';
  return `${bonus.leadin} ${parts} ${bonus.category} ${bonus.subcategory} ${bonus.set?.name || ''}`.toLowerCase();
}

// Generate n-grams from text for fuzzy matching
function getNGrams(text: string, n: number): Set<string> {
  const ngrams = new Set<string>();
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  for (const word of words) {
    if (word.length >= n) {
      for (let i = 0; i <= word.length - n; i++) {
        ngrams.add(word.substring(i, i + n));
      }
    }
  }

  return ngrams;
}

// Calculate fuzzy similarity between two strings using n-grams
function fuzzyMatch(str1: string, str2: string): number {
  const ngrams1 = getNGrams(str1, 3);
  const ngrams2 = getNGrams(str2, 3);

  if (ngrams1.size === 0 || ngrams2.size === 0) return 0;

  let intersection = 0;
  for (const gram of ngrams1) {
    if (ngrams2.has(gram)) intersection++;
  }

  const union = ngrams1.size + ngrams2.size - intersection;
  return union > 0 ? intersection / union : 0;
}

// Adaptive semantic search that learns from the data (FREE - no hardcoded concepts!)
function semanticSearch(bonuses: Bonus[], query: string, useSemanticMode: boolean): Bonus[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  // Score each bonus
  const scored = bonuses.map(bonus => {
    const text = createBonusText(bonus);
    let score = 0;

    // 1. EXACT PHRASE MATCH (highest priority)
    if (text.includes(queryLower)) {
      score += 300;
    }

    // 2. EXACT WORD MATCHES
    for (const word of queryWords) {
      // Exact word match
      const exactRegex = new RegExp(`\\b${word}\\b`, 'gi');
      const exactMatches = text.match(exactRegex) || [];
      score += exactMatches.length * 50;

      // Partial word match (e.g., "music" matches "musician")
      const partialRegex = new RegExp(`\\b\\w*${word}\\w*\\b`, 'gi');
      const partialMatches = text.match(partialRegex) || [];
      score += (partialMatches.length - exactMatches.length) * 20;
    }

    // 3. SEMANTIC MODE: Fuzzy matching and context understanding
    if (useSemanticMode) {
      // Fuzzy match on category/subcategory (catches related terms)
      const categoryText = `${bonus.category} ${bonus.subcategory}`.toLowerCase();
      const fuzzyScore = fuzzyMatch(queryLower, categoryText);
      score += fuzzyScore * 100;

      // Look for any words that are similar to query words
      const allWords = text.split(/\s+/);
      for (const word of queryWords) {
        for (const textWord of allWords) {
          if (textWord.length > 3 && word.length > 3) {
            const similarity = fuzzyMatch(word, textWord);
            if (similarity > 0.5) {
              score += similarity * 30;
            }
          }
        }
      }

      // Multi-word query bonus (rewards matching context)
      if (queryWords.length > 1) {
        const wordMatches = queryWords.filter(word => text.includes(word)).length;
        if (wordMatches > 1) {
          score += wordMatches * 40; // Strong bonus for multiple matches
        }
      }
    }

    // 4. CATEGORY/SUBCATEGORY DIRECT MATCHES
    if (bonus.category?.toLowerCase().includes(queryLower)) score += 100;
    if (bonus.subcategory?.toLowerCase().includes(queryLower)) score += 100;

    // 5. ANSWER FIELD PRIORITY (answers often contain key terms)
    for (const part of bonus.parts || []) {
      if (part.answer?.toLowerCase().includes(queryLower)) {
        score += 80;
      }
    }

    return { bonus, score };
  });

  // Return top matches, sorted by relevance
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.bonus);
}

export async function POST(request: NextRequest) {
  try {
    const { query, category, useSemanticMode = true } = await request.json();

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Load bonuses from category
    const bonuses = await loadBonusesByCategory(category);

    if (bonuses.length === 0) {
      return NextResponse.json({ bonuses: [], count: 0 });
    }

    // Use free semantic search (no API key needed!)
    const results = semanticSearch(bonuses, query, useSemanticMode);

    // Limit results
    const limitedResults = results.slice(0, 100);

    return NextResponse.json({
      bonuses: limitedResults,
      count: limitedResults.length,
      query,
      method: useSemanticMode ? 'semantic' : 'keyword',
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', bonuses: [] },
      { status: 500 }
    );
  }
}
