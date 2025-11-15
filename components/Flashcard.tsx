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

  return (
    <div className="space-y-6">
      {/* Bonus metadata */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-3">
          <div className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-sm font-bold shadow-xl">
            {bonus.category}
            {bonus.subcategory && ` • ${bonus.subcategory}`}
          </div>
          <div className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl text-white text-sm font-bold shadow-xl">
            📅 {bonus.set.name} ({bonus.set.year})
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={revealAll}
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-xl transition-all transform hover:scale-105"
          >
            Show All Answers
          </button>
          <button
            onClick={hideAll}
            className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 shadow-xl transition-all transform hover:scale-105"
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Lead-in - BLUE */}
      {bonus.leadin && (
        <div className="p-8 rounded-3xl shadow-2xl transform hover:scale-[1.01] transition-all" style={{ backgroundColor: '#2563eb' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>Lead-in</h3>
          </div>
          <p className="text-lg leading-relaxed font-medium" style={{ color: '#ffffff' }}>
            {bonus.leadin}
          </p>
        </div>
      )}

      {/* Part 1 - LIGHT BLUE question, BLUE answer */}
      {bonus.parts[0] && (
        <div className="space-y-4">
          {/* Question - Light Blue */}
          <div className="p-8 rounded-3xl shadow-2xl transform hover:scale-[1.01] transition-all" style={{ backgroundColor: '#bfdbfe' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❓</span>
              <h3 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>Part 1 • {bonus.parts[0].value} points</h3>
            </div>
            <p className="text-lg leading-relaxed font-semibold" style={{ color: '#1e3a8a' }}>
              {bonus.parts[0].question}
            </p>
          </div>

          {/* Answer - Blue */}
          <button
            onClick={() => toggleReveal(0)}
            className="w-full text-left"
          >
            <div className={`p-8 rounded-3xl shadow-2xl transition-all transform ${
              revealedParts.has(0) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#2563eb' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>Answer 1</h3>
              </div>
              {revealedParts.has(0) ? (
                <p className="text-2xl font-bold leading-relaxed" style={{ color: '#ffffff' }}>
                  {bonus.parts[0].answer}
                </p>
              ) : (
                <p className="text-center text-lg font-semibold animate-pulse" style={{ color: '#bfdbfe' }}>
                  👆 Click to reveal answer
                </p>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Part 2 - LIGHT GREEN question, BLUE answer */}
      {bonus.parts[1] && (
        <div className="space-y-4">
          {/* Question - Light Green */}
          <div className="p-8 rounded-3xl shadow-2xl transform hover:scale-[1.01] transition-all" style={{ backgroundColor: '#bbf7d0' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❓</span>
              <h3 className="text-xl font-bold" style={{ color: '#14532d' }}>Part 2 • {bonus.parts[1].value} points</h3>
            </div>
            <p className="text-lg leading-relaxed font-semibold" style={{ color: '#14532d' }}>
              {bonus.parts[1].question}
            </p>
          </div>

          {/* Answer - Blue */}
          <button
            onClick={() => toggleReveal(1)}
            className="w-full text-left"
          >
            <div className={`p-8 rounded-3xl shadow-2xl transition-all transform ${
              revealedParts.has(1) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#2563eb' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>Answer 2</h3>
              </div>
              {revealedParts.has(1) ? (
                <p className="text-2xl font-bold leading-relaxed" style={{ color: '#ffffff' }}>
                  {bonus.parts[1].answer}
                </p>
              ) : (
                <p className="text-center text-lg font-semibold animate-pulse" style={{ color: '#bfdbfe' }}>
                  👆 Click to reveal answer
                </p>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Part 3 - LIGHT RED/PINK question, BLUE answer */}
      {bonus.parts[2] && (
        <div className="space-y-4">
          {/* Question - Light Red/Pink */}
          <div className="p-8 rounded-3xl shadow-2xl transform hover:scale-[1.01] transition-all" style={{ backgroundColor: '#fecaca' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❓</span>
              <h3 className="text-xl font-bold" style={{ color: '#7f1d1d' }}>Part 3 • {bonus.parts[2].value} points</h3>
            </div>
            <p className="text-lg leading-relaxed font-semibold" style={{ color: '#7f1d1d' }}>
              {bonus.parts[2].question}
            </p>
          </div>

          {/* Answer - Blue */}
          <button
            onClick={() => toggleReveal(2)}
            className="w-full text-left"
          >
            <div className={`p-8 rounded-3xl shadow-2xl transition-all transform ${
              revealedParts.has(2) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#2563eb' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>Answer 3</h3>
              </div>
              {revealedParts.has(2) ? (
                <p className="text-2xl font-bold leading-relaxed" style={{ color: '#ffffff' }}>
                  {bonus.parts[2].answer}
                </p>
              ) : (
                <p className="text-center text-lg font-semibold animate-pulse" style={{ color: '#bfdbfe' }}>
                  👆 Click to reveal answer
                </p>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
