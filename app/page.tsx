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
    <main className="min-h-screen px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6 p-4 rounded-3xl shadow-2xl" style={{ backgroundColor: '#2563eb' }}>
            <span className="text-6xl">🎓</span>
          </div>
          <h1 className="text-6xl font-black mb-4" style={{ color: '#1e40af' }}>
            Quizbowl Flashcards
          </h1>
          <p className="text-2xl font-semibold" style={{ color: '#3b82f6' }}>
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
      </div>
    </main>
  );
}
