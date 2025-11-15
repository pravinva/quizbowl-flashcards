'use client';

import { useEffect, useState } from 'react';
import type { CategoryInfo } from '@/types/quizbowl';

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
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
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
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
    trash: '🎬',
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
          Choose your category to begin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                  {categoryEmojis[category.id] || '📖'}
                </span>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-white transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-white transition-colors duration-300"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors duration-300 font-medium">
                  {category.count} bonuses available
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
