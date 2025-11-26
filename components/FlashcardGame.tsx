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
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-sky-400 border-t-transparent"></div>
        <p className="mt-4 text-xl font-semibold" style={{ color: '#0284c7' }}>
          Loading bonuses...
        </p>
      </div>
    );
  }

  if (bonuses.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-xl font-semibold mb-8" style={{ color: '#0284c7' }}>
          No bonuses available for this category yet.
        </p>
        <p className="text-lg mb-8" style={{ color: '#0ea5e9' }}>
          Run <code className="bg-sky-100 px-3 py-1.5 rounded-lg font-mono text-sm" style={{ color: '#0c4a6e' }}>npm run fetch-data</code> to download bonuses from QBReader.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gradient-to-r from-sky-400 to-purple-400 text-white rounded-lg hover:from-sky-500 hover:to-purple-500 transition-all shadow-md font-semibold"
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
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
          {categories.map((cat) => {
            const isActive = cat.id === category;
            const categoryGradients: Record<string, string> = {
              literature: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              history: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              science: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              'fine-arts': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              religion: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              mythology: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              philosophy: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              'social-science': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              'current-events': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              geography: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              'other-academic': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
              'pop-culture': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            };
            const gradient = categoryGradients[cat.id] || 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)';
            
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange?.(cat.id)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md ${
                  isActive
                    ? 'text-white scale-105'
                    : 'text-white hover:scale-105 active:scale-95 opacity-70 hover:opacity-100'
                }`}
                style={isActive ? { background: gradient } : { background: gradient, opacity: 0.7 }}
              >
                <span className="mr-1.5">{categoryEmojis[cat.id] || '📖'}</span>
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Header with back button and progress */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-sky-400 to-purple-400 text-white rounded-full font-semibold hover:from-sky-500 hover:to-purple-500 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          ← Home
        </button>
        <div className="px-5 py-2.5 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-full font-semibold shadow-md">
          {currentIndex + 1} / {bonuses.length}
        </div>
      </div>

      <Flashcard key={currentBonus._id} bonus={currentBonus} />

      {/* Navigation buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:hover:to-purple-600 transition-all duration-200 active:scale-95"
        >
          ⬅️ Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === bonuses.length - 1}
          className="flex-1 px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-xl font-semibold hover:from-sky-500 hover:to-sky-600 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-sky-400 disabled:hover:to-sky-500 transition-all duration-200 active:scale-95"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}
