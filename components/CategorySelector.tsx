'use client';

import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import type { CategoryInfo } from '@/types/quizbowl';

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
  onSearch?: (query: string, useSemanticMode: boolean, category: string) => void;
}

// This will be replaced with actual data from Firebase/API
const MOCK_CATEGORIES: CategoryInfo[] = [
  { id: 'literature', name: 'Literature', count: 150 },
  { id: 'history', name: 'History', count: 200 },
  { id: 'science', name: 'Science', count: 180 },
  { id: 'fine-arts', name: 'Fine Arts', count: 120 },
  { id: 'religion', name: 'Religion', count: 90 },
  { id: 'mythology', name: 'Mythology', count: 85 },
  { id: 'philosophy', name: 'Philosophy', count: 75 },
  { id: 'social-science', name: 'Social Science', count: 110 },
  { id: 'geography', name: 'Geography', count: 95 },
  { id: 'other-academic', name: 'Other Academic', count: 60 },
  { id: 'trash', name: 'Trash', count: 40 },
];

export default function CategorySelector({
  onSelectCategory,
  onSearch,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();

        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          // Fallback to mock data if no data available
          setCategories(MOCK_CATEGORIES);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data on error
        setCategories(MOCK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }}></div>
        <p className="mt-4 text-xl font-bold" style={{ color: '#2563eb' }}>
          Loading categories...
        </p>
      </div>
    );
  }

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

  const categoryColors: Record<string, { bg: string; text: string }> = {
    literature: { bg: '#3b82f6', text: '#ffffff' },
    history: { bg: '#10b981', text: '#ffffff' },
    science: { bg: '#8b5cf6', text: '#ffffff' },
    'fine-arts': { bg: '#ec4899', text: '#ffffff' },
    religion: { bg: '#06b6d4', text: '#ffffff' },
    mythology: { bg: '#f59e0b', text: '#ffffff' },
    philosophy: { bg: '#6366f1', text: '#ffffff' },
    'social-science': { bg: '#14b8a6', text: '#ffffff' },
    'current-events': { bg: '#ef4444', text: '#ffffff' },
    geography: { bg: '#22c55e', text: '#ffffff' },
    'other-academic': { bg: '#a855f7', text: '#ffffff' },
    'pop-culture': { bg: '#f97316', text: '#ffffff' },
  };

  const handleSearch = (query: string, useSemanticMode: boolean) => {
    // Pass search to parent with a default category (or 'all')
    if (onSearch) {
      // Search across all categories by using the first category or 'all'
      onSearch(query, useSemanticMode, categories[0]?.id || 'literature');
    }
  };

  const handleClearSearch = () => {
    // Just a placeholder - parent will handle navigation
  };

  return (
    <div className="space-y-8">
      <div className="text-center p-6 rounded-3xl shadow-xl" style={{ backgroundColor: '#2563eb' }}>
        <p className="text-2xl font-bold" style={{ color: '#ffffff' }}>
          Choose Your Category
        </p>
        <p className="text-lg mt-2" style={{ color: '#bfdbfe' }}>
          Select a category to start practicing
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto">
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder='Search all bonuses... e.g., "baroque musicians from France"'
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const colors = categoryColors[category.id] || { bg: '#2563eb', text: '#ffffff' };

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: colors.bg }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-5xl">
                  {categoryEmojis[category.id] || '📖'}
                </span>
                <h3 className="text-xl font-bold text-center" style={{ color: colors.text }}>
                  {category.name}
                </h3>
                <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {category.count} bonuses
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
