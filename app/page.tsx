'use client';

import { useState } from 'react';
import CategorySelector from '@/components/CategorySelector';
import FlashcardGame from '@/components/FlashcardGame';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-3xl">🎓</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Quizbowl Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Master quizbowl bonuses with interactive practice
          </p>
        </div>

        {/* Content */}
        <div className="backdrop-blur-sm">
          {!selectedCategory ? (
            <CategorySelector onSelectCategory={setSelectedCategory} />
          ) : (
            <FlashcardGame
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
