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
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: '#38bdf8', borderTopColor: 'transparent' }}></div>
        <p className="mt-4 text-xl font-bold" style={{ color: '#0284c7' }}>
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

  const categoryColors: Record<string, { gradient: string; text: string; hover: string }> = {
    literature: { 
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)'
    },
    history: { 
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)'
    },
    science: { 
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)'
    },
    'fine-arts': { 
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #db2777 0%, #be185d 50%, #9f1239 100%)'
    },
    religion: { 
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #155e75 100%)'
    },
    mythology: { 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)'
    },
    philosophy: { 
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #3730a3 100%)'
    },
    'social-science': { 
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)'
    },
    'current-events': { 
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)'
    },
    geography: { 
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)'
    },
    'other-academic': { 
      gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #6b21a8 100%)'
    },
    'pop-culture': { 
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)', 
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #9a3412 100%)'
    },
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
      <div className="text-center p-6 rounded-3xl shadow-xl" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' }}>
        <p className="text-2xl font-bold" style={{ color: '#ffffff' }}>
          Choose Your Category
        </p>
        <p className="text-lg mt-2" style={{ color: '#e0f2fe' }}>
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

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => {
          const colors = categoryColors[category.id] || { 
            gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)', 
            text: '#ffffff',
            hover: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)'
          };

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="p-4 sm:p-6 rounded-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 min-h-[160px] sm:min-h-[180px] flex items-center justify-center"
              style={{ 
                background: colors.gradient,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.gradient;
              }}
            >
              <div className="flex flex-col items-center gap-2 sm:gap-3 w-full">
                <span className="text-4xl sm:text-5xl">
                  {categoryEmojis[category.id] || '📖'}
                </span>
                <h3 className="text-base sm:text-xl font-bold text-center" style={{ color: colors.text }}>
                  {category.name}
                </h3>
                <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                <p className="text-xs sm:text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>
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
