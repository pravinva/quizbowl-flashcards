'use client';

import { useState } from 'react';
import type { Bonus } from '@/types/quizbowl';

interface FlashcardProps {
  bonus: Bonus;
}

export default function Flashcard({ bonus }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [currentPart, setCurrentPart] = useState(0);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNextPart = () => {
    if (currentPart < bonus.parts.length - 1) {
      setCurrentPart(currentPart + 1);
      setFlipped(false);
    }
  };

  const handlePreviousPart = () => {
    if (currentPart > 0) {
      setCurrentPart(currentPart - 1);
      setFlipped(false);
    }
  };

  const part = bonus.parts[currentPart];

  return (
    <div className="space-y-6">
      {/* Bonus metadata */}
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-semibold shadow-lg">
          {bonus.category}
          {bonus.subcategory && ` • ${bonus.subcategory}`}
        </div>
        <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium border-2 border-gray-200 dark:border-gray-700 shadow-md">
          📅 {bonus.set.name} ({bonus.set.year})
        </div>
      </div>

      {/* Lead-in (shown only on first part) */}
      {currentPart === 0 && bonus.leadin && (
        <div className="relative p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-xs font-bold shadow-md">
            💡 Lead-in
          </div>
          <p className="text-gray-800 dark:text-gray-200 mt-2 leading-relaxed">
            {bonus.leadin}
          </p>
        </div>
      )}

      {/* Flashcard */}
      <div
        onClick={handleFlip}
        className="relative cursor-pointer group"
        style={{ perspective: '1200px' }}
      >
        <div
          className={`relative w-full h-full transition-all duration-700 ease-out`}
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front - Question */}
          <div
            className="absolute w-full h-full"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl border-2 border-blue-200 dark:border-blue-800 flex flex-col justify-between transform hover:shadow-2xl hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                    ❓ Part {currentPart + 1} of {bonus.parts.length}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                    {part.value} pts
                  </span>
                </div>
                <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-100 font-medium">
                  {part.question}
                </p>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                  👆 Click to reveal answer
                </p>
              </div>
            </div>
          </div>

          {/* Back - Answer */}
          <div
            className="absolute w-full h-full"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 rounded-3xl shadow-xl border-2 border-green-300 dark:border-green-700 flex flex-col justify-between transform hover:shadow-2xl hover:scale-[1.02] hover:border-green-500 dark:hover:border-green-600 transition-all duration-300">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold rounded-full shadow-lg">
                    ✅ Answer - Part {currentPart + 1}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                    {part.value} pts
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                  {part.answer}
                </p>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  👆 Click to see question again
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part navigation */}
      {bonus.parts.length > 1 && (
        <div className="flex justify-center gap-4 items-center">
          <button
            onClick={handlePreviousPart}
            disabled={currentPart === 0}
            className="px-6 py-3 text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600 transition-all duration-300 transform hover:scale-105"
          >
            ← Previous
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-md">
            {bonus.parts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPart(index);
                  setFlipped(false);
                }}
                className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentPart
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-110'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to part ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNextPart}
            disabled={currentPart === bonus.parts.length - 1}
            className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
