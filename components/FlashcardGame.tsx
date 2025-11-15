'use client';

import { useEffect, useState } from 'react';
import Flashcard from './Flashcard';
import BonusFilters, { type FilterOptions } from './BonusFilters';
import SearchBar from './SearchBar';
import type { Bonus, CategoryInfo } from '@/types/quizbowl';

interface FlashcardGameProps {
  category: string;
  onBack: () => void;
  onCategoryChange?: (category: string) => void;
  initialSearch?: { query: string; useSemanticMode: boolean } | null;
}

export default function FlashcardGame({ category, onBack, onCategoryChange, initialSearch }: FlashcardGameProps) {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [allBonuses, setAllBonuses] = useState<Bonus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    minYear: 2022,
    maxYear: new Date().getFullYear(),
    difficultyLevel: 'all',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // If there's an initial search, trigger it; otherwise load bonuses normally
    if (initialSearch) {
      handleSearch(initialSearch.query, initialSearch.useSemanticMode);
    } else {
      loadBonuses();
    }
    setCurrentIndex(0); // Reset to first bonus when category changes
  }, [category]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories.filter((c: CategoryInfo) => c.count > 0));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBonuses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bonuses/${category}?random=true&limit=200`);
      const data = await response.json();

      if (data.bonuses && data.bonuses.length > 0) {
        setAllBonuses(data.bonuses);
        applyFilters(data.bonuses, filters);
      } else {
        setAllBonuses([]);
        setBonuses([]);
      }
    } catch (error) {
      console.error('Error loading bonuses:', error);
      setAllBonuses([]);
      setBonuses([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (bonusesToFilter: Bonus[], filterOptions: FilterOptions, query = searchQuery) => {
    let filtered = bonusesToFilter;

    // Filter by search query
    if (query.trim().length >= 2) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(bonus => {
        // Search in leadin
        if (bonus.leadin?.toLowerCase().includes(lowerQuery)) return true;

        // Search in parts (questions and answers)
        return bonus.parts?.some(part => {
          const questionMatch = part.question?.toLowerCase().includes(lowerQuery);
          const answerMatch = part.answer?.toLowerCase().includes(lowerQuery);
          return questionMatch || answerMatch;
        });
      });
    }

    // Filter by year
    filtered = filtered.filter(bonus => {
      const year = bonus.set?.year || 0;
      return year >= filterOptions.minYear && year <= filterOptions.maxYear;
    });

    // Filter by difficulty level
    if (filterOptions.difficultyLevel !== 'all') {
      filtered = filtered.filter(bonus => {
        const diff = bonus.difficulty || 5;
        if (filterOptions.difficultyLevel === 'easy') return diff >= 1 && diff <= 4;
        if (filterOptions.difficultyLevel === 'medium') return diff >= 5 && diff <= 7;
        if (filterOptions.difficultyLevel === 'hard') return diff >= 8 && diff <= 10;
        return true;
      });
    }

    setBonuses(filtered);
    setCurrentIndex(0);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    applyFilters(allBonuses, newFilters);
  };

  const handleSearch = async (query: string, useSemanticMode: boolean) => {
    setSearchQuery(query);
    setLoading(true);

    try {
      // Call semantic search API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          category,
          useSemanticMode,
        }),
      });

      const data = await response.json();

      if (data.bonuses && data.bonuses.length > 0) {
        // Store search results and apply current filters
        setAllBonuses(data.bonuses);
        applyFilters(data.bonuses, filters, '');
      } else {
        setBonuses([]);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fall back to local filtering
      applyFilters(allBonuses, filters, query);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // Reload bonuses to reset search
    loadBonuses();
  };

  const handleNext = () => {
    if (currentIndex < bonuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading bonuses...
        </p>
      </div>
    );
  }

  if (bonuses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          No bonuses available for this category yet.
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          Run <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">npm run fetch-data</code> to download bonuses from QBReader.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  const currentBonus = bonuses[currentIndex];

  const categoryEmojis: Record<string, string> = {
    literature: '📚',
    history: '🏛️',
    science: '🔬',
    'fine-arts': '🎨',
    religion: '🕊️',
    mythology: '⚡',
    philosophy: '🤔',
    'social-science': '📊',
    'current-events': '📰',
    geography: '🌍',
    'other-academic': '🎯',
    'pop-culture': '🎬',
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <BonusFilters onFilterChange={handleFilterChange} />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      {/* Category tabs at top */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange?.(cat.id)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                cat.id === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              <span className="mr-1.5">{categoryEmojis[cat.id] || '📖'}</span>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Header with back button and progress */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
        >
          ← Home
        </button>
        <div className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold shadow-md">
          {currentIndex + 1} / {bonuses.length}
        </div>
      </div>

      <Flashcard key={currentBonus._id} bonus={currentBonus} />

      {/* Navigation buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-100 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
        >
          ⬅️ Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === bonuses.length - 1}
          className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all duration-200"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}
