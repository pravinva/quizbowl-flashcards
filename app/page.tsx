'use client';

import { useState, useEffect, useRef } from 'react';
import CategorySelector from '@/components/CategorySelector';
import FlashcardGame from '@/components/FlashcardGame';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [initialSearch, setInitialSearch] = useState<{ query: string; useSemanticMode: boolean } | null>(null);
  const flashcardGameRef = useRef<{ triggerSearch: (query: string, useSemanticMode: boolean) => void } | null>(null);

  const handleSearchFromHome = (query: string, useSemanticMode: boolean, category: string) => {
    // Set the category and store the search query
    setInitialSearch({ query, useSemanticMode });
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setInitialSearch(null);
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 lg:px-16 lg:py-16" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4 sm:mb-6 p-3 sm:p-4 rounded-3xl shadow-2xl" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' }}>
            <span className="text-4xl sm:text-5xl md:text-6xl">🎓</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4" style={{ color: '#0c4a6e' }}>
            Quizbowl Flashcards
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold px-2" style={{ color: '#0284c7' }}>
            Master quizbowl bonuses with interactive practice
          </p>
        </div>

        {/* Content */}
        <div>
          {!selectedCategory ? (
            <CategorySelector
              onSelectCategory={setSelectedCategory}
              onSearch={handleSearchFromHome}
            />
          ) : (
            <FlashcardGame
              category={selectedCategory}
              onBack={handleBack}
              onCategoryChange={setSelectedCategory}
              initialSearch={initialSearch}
            />
          )}
        </div>

        {/* Credits Footer */}
        <div className="text-center mt-8 sm:mt-12 pb-4">
          <p className="text-xs sm:text-sm" style={{ color: '#0284c7' }}>
            Created by Pravin using Claude Code and QBReader
          </p>
        </div>
      </div>
    </main>
  );
}
