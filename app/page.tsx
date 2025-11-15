'use client';

import { useState } from 'react';
import CategorySelector from '@/components/CategorySelector';
import FlashcardGame from '@/components/FlashcardGame';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Quizbowl Flashcards
        </h1>

        {!selectedCategory ? (
          <CategorySelector onSelectCategory={setSelectedCategory} />
        ) : (
          <FlashcardGame
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
          />
        )}
      </div>
    </main>
  );
}
