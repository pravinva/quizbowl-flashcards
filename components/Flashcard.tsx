'use client';

import { useState } from 'react';
import type { Bonus } from '@/types/quizbowl';

interface FlashcardProps {
  bonus: Bonus;
}

export default function Flashcard({ bonus }: FlashcardProps) {
  const [revealedParts, setRevealedParts] = useState<Set<number>>(new Set());

  const toggleReveal = (partIndex: number) => {
    const newRevealed = new Set(revealedParts);
    if (newRevealed.has(partIndex)) {
      newRevealed.delete(partIndex);
    } else {
      newRevealed.add(partIndex);
    }
    setRevealedParts(newRevealed);
  };

  const revealAll = () => {
    setRevealedParts(new Set([0, 1, 2]));
  };

  const hideAll = () => {
    setRevealedParts(new Set());
  };

  const partColors = [
    {
      question: 'from-blue-400 to-blue-600',
      answer: 'from-green-400 to-green-600',
      questionBg: 'bg-blue-50 dark:bg-blue-900/20',
      answerBg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      question: 'from-purple-400 to-purple-600',
      answer: 'from-emerald-400 to-emerald-600',
      questionBg: 'bg-purple-50 dark:bg-purple-900/20',
      answerBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      question: 'from-pink-400 to-pink-600',
      answer: 'from-teal-400 to-teal-600',
      questionBg: 'bg-pink-50 dark:bg-pink-900/20',
      answerBg: 'bg-teal-50 dark:bg-teal-900/20',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Bonus metadata */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-semibold shadow-lg">
            {bonus.category}
            {bonus.subcategory && ` • ${bonus.subcategory}`}
          </div>
          <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium border-2 border-gray-200 dark:border-gray-700 shadow-md">
            📅 {bonus.set.name} ({bonus.set.year})
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={revealAll}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-md transition-all"
          >
            Show All
          </button>
          <button
            onClick={hideAll}
            className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold rounded-lg hover:from-gray-600 hover:to-gray-700 shadow-md transition-all"
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Lead-in */}
      {bonus.leadin && (
        <div className="relative p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 shadow-lg">
          <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white text-xs font-bold shadow-md">
            💡 Lead-in
          </div>
          <p className="text-gray-800 dark:text-gray-200 mt-2 leading-relaxed font-medium">
            {bonus.leadin}
          </p>
        </div>
      )}

      {/* Parts - stacked vertically */}
      {bonus.parts.map((part, index) => {
        const isRevealed = revealedParts.has(index);
        const colors = partColors[index % partColors.length];

        return (
          <div key={index} className="space-y-3">
            {/* Question Box */}
            <div className={`relative p-6 ${colors.questionBg} rounded-2xl border-2 border-blue-300 dark:border-blue-700 shadow-lg`}>
              <div className={`absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r ${colors.question} rounded-full text-white text-xs font-bold shadow-md`}>
                ❓ Part {index + 1} • {part.value} pts
              </div>
              <p className="text-gray-800 dark:text-gray-200 mt-2 leading-relaxed text-lg font-medium">
                {part.question}
              </p>
            </div>

            {/* Answer Box - Toggle */}
            <button
              onClick={() => toggleReveal(index)}
              className="w-full text-left"
            >
              <div className={`relative p-6 ${colors.answerBg} rounded-2xl border-2 ${
                isRevealed ? 'border-green-400 dark:border-green-600' : 'border-green-300 dark:border-green-700'
              } shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isRevealed ? 'transform scale-[1.02]' : ''
              }`}>
                <div className={`absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r ${colors.answer} rounded-full text-white text-xs font-bold shadow-md`}>
                  ✅ Answer {index + 1}
                </div>
                <div className="mt-2">
                  {isRevealed ? (
                    <p className="text-gray-900 dark:text-white text-xl font-bold leading-relaxed">
                      {part.answer}
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center font-medium animate-pulse">
                      👆 Click to reveal answer
                    </p>
                  )}
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
