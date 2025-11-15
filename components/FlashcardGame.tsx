'use client';

import { useEffect, useState } from 'react';
import Flashcard from './Flashcard';
import type { Bonus } from '@/types/quizbowl';

interface FlashcardGameProps {
  category: string;
  onBack: () => void;
}

export default function FlashcardGame({ category, onBack }: FlashcardGameProps) {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBonuses();
  }, [category]);

  const loadBonuses = async () => {
    try {
      const response = await fetch(`/api/bonuses/${category}?random=true&limit=50`);
      const data = await response.json();

      if (data.bonuses && data.bonuses.length > 0) {
        setBonuses(data.bonuses);
      } else {
        setBonuses([]);
      }
    } catch (error) {
      console.error('Error loading bonuses:', error);
      setBonuses([]);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Categories
        </button>
        <span className="text-gray-600 dark:text-gray-400">
          {currentIndex + 1} / {bonuses.length}
        </span>
      </div>

      <Flashcard bonus={currentBonus} />

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === bonuses.length - 1}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
