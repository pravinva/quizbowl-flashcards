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
    <div className="space-y-8">
      {/* Header with back button and progress */}
      <div className="flex justify-between items-center backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          ← Categories
        </button>
        <div className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg">
          Question {currentIndex + 1} of {bonuses.length}
        </div>
      </div>

      <Flashcard bonus={currentBonus} />

      {/* Navigation buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600 transition-all duration-300 transform hover:scale-105"
        >
          ⬅️ Previous Bonus
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === bonuses.length - 1}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Next Bonus ➡️
        </button>
      </div>
    </div>
  );
}
