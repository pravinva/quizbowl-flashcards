import { NextRequest, NextResponse } from 'next/server';
import { loadBonusesByCategory } from '@/lib/loadBonuses';
import type { Bonus } from '@/types/quizbowl';

// Concept mappings for semantic understanding (free, no API needed!)
const conceptMap: Record<string, string[]> = {
  'baroque': ['baroque', 'bach', 'vivaldi', 'handel', 'fugue', 'concerto grosso', '17th century', '18th century'],
  'france': ['french', 'france', 'parisian', 'louis', 'versailles'],
  'musician': ['composer', 'music', 'symphony', 'opera', 'song', 'piece'],
  'artist': ['painter', 'painting', 'sculpture', 'art', 'canvas', 'portrait'],
  'writer': ['author', 'wrote', 'novel', 'poem', 'book', 'literature'],
  'scientist': ['scientist', 'discovered', 'theory', 'experiment', 'research'],
  'war': ['battle', 'military', 'fought', 'army', 'conflict', 'campaign'],
  'ancient': ['ancient', 'classical', 'greco-roman', 'antiquity'],
  'renaissance': ['renaissance', 'medici', 'humanism', '15th century', '16th century'],
  'american': ['united states', 'american', 'usa', 'u.s.'],
};

// Helper to create searchable text from a bonus
function createBonusText(bonus: Bonus): string {
  const parts = bonus.parts?.map(p => `${p.question} ${p.answer}`).join(' ') || '';
  return `${bonus.leadin} ${parts} ${bonus.category} ${bonus.subcategory} ${bonus.set?.name || ''}`.toLowerCase();
}

// Expand query with related concepts
function expandQuery(query: string): string[] {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);
  const expandedTerms = new Set(words);

  // Add related concepts
  for (const word of words) {
    for (const [concept, related] of Object.entries(conceptMap)) {
      if (word.includes(concept) || concept.includes(word)) {
        related.forEach(term => expandedTerms.add(term));
      }
    }
  }

  return Array.from(expandedTerms);
}

// Smart semantic search using concept expansion (FREE - no API needed!)
function semanticSearch(bonuses: Bonus[], query: string, useSemanticMode: boolean): Bonus[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  // Expand query with semantic concepts if in semantic mode
  const searchTerms = useSemanticMode ? expandQuery(query) : queryWords;

  // Score each bonus
  const scored = bonuses.map(bonus => {
    const text = createBonusText(bonus);
    let score = 0;

    // Exact phrase match gets highest score
    if (text.includes(queryLower)) {
      score += 200;
    }

    // Count matching terms
    for (const term of searchTerms) {
      if (term.length < 2) continue;

      const regex = new RegExp(`\\b${term}\\w*`, 'gi');
      const matches = text.match(regex) || [];
      const count = matches.length;

      // Higher score for exact matches
      if (queryWords.includes(term)) {
        score += count * 15;
      } else {
        // Lower score for expanded concept matches
        score += count * 8;
      }
    }

    // Boost for category/subcategory matches
    if (bonus.category?.toLowerCase().includes(queryLower)) score += 80;
    if (bonus.subcategory?.toLowerCase().includes(queryLower)) score += 80;

    // Bonus for matching multiple query words
    const wordMatches = queryWords.filter(word => text.includes(word)).length;
    if (wordMatches > 1) {
      score += wordMatches * 25;
    }

    return { bonus, score };
  });

  // Return top matches
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
