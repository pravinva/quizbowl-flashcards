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
    <div className="space-y-4">
      {/* Bonus metadata */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          <span className="font-semibold">Category:</span> {bonus.category}
          {bonus.subcategory && ` - ${bonus.subcategory}`}
        </p>
        <p>
          <span className="font-semibold">Set:</span> {bonus.set.name} (
          {bonus.set.year})
        </p>
      </div>

      {/* Lead-in (shown only on first part) */}
      {currentPart === 0 && bonus.leadin && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Lead-in:
          </p>
          <p className="text-gray-800 dark:text-gray-200">{bonus.leadin}</p>
        </div>
      )}

      {/* Flashcard */}
      <div
        onClick={handleFlip}
        className="relative min-h-[300px] cursor-pointer perspective-1000"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front - Question */}
          <div
            className={`absolute w-full h-full backface-hidden ${
              flipped ? 'invisible' : 'visible'
            }`}
          >
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 min-h-[300px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Part {currentPart + 1} of {bonus.parts.length}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {part.value} points
                  </span>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  {part.question}
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                Click to reveal answer
              </p>
            </div>
          </div>

          {/* Back - Answer */}
          <div
            className={`absolute w-full h-full backface-hidden rotate-y-180 ${
              flipped ? 'visible' : 'invisible'
            }`}
          >
            <div className="p-8 bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg border-2 border-green-300 dark:border-green-700 min-h-[300px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Answer - Part {currentPart + 1}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {part.value} points
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {part.answer}
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                Click to see question again
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part navigation */}
      {bonus.parts.length > 1 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePreviousPart}
            disabled={currentPart === 0}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous Part
          </button>
          <div className="flex items-center gap-2">
            {bonus.parts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPart(index);
                  setFlipped(false);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentPart
                    ? 'bg-blue-600 dark:bg-blue-400'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to part ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNextPart}
            disabled={currentPart === bonus.parts.length - 1}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Part
          </button>
        </div>
      )}
    </div>
  );
}
