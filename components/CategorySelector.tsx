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

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600 dark:text-gray-400">
        Select a category to start practicing:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left group"
          >
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {category.count} bonuses
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
