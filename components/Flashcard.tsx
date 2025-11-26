'use client';

import { useState } from 'react';
import type { Bonus } from '@/types/quizbowl';

interface FlashcardProps {
  bonus: Bonus;
}

export default function Flashcard({ bonus }: FlashcardProps) {
  const [revealedQuestions, setRevealedQuestions] = useState<Set<number>>(new Set());
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const toggleQuestion = (partIndex: number) => {
    const newRevealed = new Set(revealedQuestions);
    if (newRevealed.has(partIndex)) {
      newRevealed.delete(partIndex);
      // Also hide the answer when hiding the question
      const newAnswers = new Set(revealedAnswers);
      newAnswers.delete(partIndex);
      setRevealedAnswers(newAnswers);
    } else {
      newRevealed.add(partIndex);
    }
    setRevealedQuestions(newRevealed);
  };

  const toggleAnswer = (partIndex: number) => {
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(partIndex)) {
      newRevealed.delete(partIndex);
    } else {
      newRevealed.add(partIndex);
    }
    setRevealedAnswers(newRevealed);
  };

  const revealAll = () => {
    setRevealedQuestions(new Set([0, 1, 2]));
    setRevealedAnswers(new Set([0, 1, 2]));
  };

  const hideAll = () => {
    setRevealedQuestions(new Set());
    setRevealedAnswers(new Set());
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bonus metadata */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-sky-400 to-purple-400 rounded-xl text-white text-xs sm:text-sm font-bold shadow-xl">
            {bonus.category}
            {bonus.subcategory && ` • ${bonus.subcategory}`}
          </div>
          <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl text-white text-xs sm:text-sm font-bold shadow-xl">
            📅 {bonus.set.name} ({bonus.set.year})
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={revealAll}
            className="flex-1 sm:flex-none px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            Show All
          </button>
          <button
            onClick={hideAll}
            className="flex-1 sm:flex-none px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Lead-in - BLUE */}
      {bonus.leadin && (
        <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-[1.01] transition-all" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' }}>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl">💡</span>
            <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#ffffff' }}>Lead-in</h3>
          </div>
          <div
            className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-center tracking-wide"
            style={{ color: '#ffffff' }}
            dangerouslySetInnerHTML={{ __html: bonus.leadin }}
          />
        </div>
      )}

      {/* Part 1 - LIGHT BLUE question, BLUE answer */}
      {bonus.parts[0] && (
        <div className="space-y-4">
          {/* Question - Light Blue */}
          <button
            onClick={() => toggleQuestion(0)}
            className="w-full"
          >
            <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] ${
              revealedQuestions.has(0) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#bfdbfe' }}>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl">❓</span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#1e3a8a' }}>Part 1 • {bonus.parts[0].value} points</h3>
              </div>
              {revealedQuestions.has(0) ? (
                <div
                  className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-center tracking-wide px-2"
                  style={{ color: '#1e3a8a' }}
                  dangerouslySetInnerHTML={{ __html: bonus.parts[0].question }}
                />
              ) : (
                <p className="text-center text-base sm:text-lg md:text-xl font-medium animate-pulse tracking-wide px-2" style={{ color: '#1e3a8a' }}>
                  👆 Click to reveal question
                </p>
              )}
            </div>
          </button>

          {/* Answer - Blue */}
          {revealedQuestions.has(0) && (
            <button
              onClick={() => toggleAnswer(0)}
              className="w-full"
            >
              <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] ${
                revealedAnswers.has(0) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`} style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' }}>
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl">✅</span>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#ffffff' }}>Answer 1</h3>
                </div>
                {revealedAnswers.has(0) ? (
                  <div
                    className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-center tracking-wide px-2"
                    style={{ color: '#ffffff' }}
                    dangerouslySetInnerHTML={{ __html: bonus.parts[0].answer }}
                  />
                ) : (
                  <p className="text-center text-base sm:text-lg md:text-xl font-medium animate-pulse tracking-wide px-2" style={{ color: '#bfdbfe' }}>
                    👆 Click to reveal answer
                  </p>
                )}
              </div>
            </button>
          )}
        </div>
      )}

      {/* Part 2 - LIGHT GREEN question, BLUE answer */}
      {bonus.parts[1] && (
        <div className="space-y-4">
          {/* Question - Light Green */}
          <button
            onClick={() => toggleQuestion(1)}
            className="w-full"
          >
            <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] ${
              revealedQuestions.has(1) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#bbf7d0' }}>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl">❓</span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#14532d' }}>Part 2 • {bonus.parts[1].value} points</h3>
              </div>
              {revealedQuestions.has(1) ? (
                <div
                  className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-center tracking-wide px-2"
                  style={{ color: '#14532d' }}
                  dangerouslySetInnerHTML={{ __html: bonus.parts[1].question }}
                />
              ) : (
                <p className="text-center text-base sm:text-lg md:text-xl font-medium animate-pulse tracking-wide px-2" style={{ color: '#14532d' }}>
                  👆 Click to reveal question
                </p>
              )}
            </div>
          </button>

          {/* Answer - Blue */}
          {revealedQuestions.has(1) && (
            <button
              onClick={() => toggleAnswer(1)}
              className="w-full"
            >
              <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] ${
                revealedAnswers.has(1) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`} style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' }}>
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl">✅</span>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#ffffff' }}>Answer 2</h3>
                </div>
                {revealedAnswers.has(1) ? (
                  <div
                    className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-center tracking-wide px-2"
                    style={{ color: '#ffffff' }}
                    dangerouslySetInnerHTML={{ __html: bonus.parts[1].answer }}
                  />
                ) : (
                  <p className="text-center text-base sm:text-lg md:text-xl font-medium animate-pulse tracking-wide px-2" style={{ color: '#bfdbfe' }}>
                    👆 Click to reveal answer
                  </p>
                )}
              </div>
            </button>
          )}
        </div>
      )}

      {/* Part 3 - LIGHT RED/PINK question, BLUE answer */}
      {bonus.parts[2] && (
        <div className="space-y-4">
          {/* Question - Light Red/Pink */}
          <button
            onClick={() => toggleQuestion(2)}
            className="w-full"
          >
            <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] ${
              revealedQuestions.has(2) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#fecaca' }}>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl">❓</span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#7f1d1d' }}>Part 3 • {bonus.parts[2].value} points</h3>
              </div>
              {revealedQuestions.has(2) ? (
                <div
                  className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-center tracking-wide px-2"
                  style={{ color: '#7f1d1d' }}
                  dangerouslySetInnerHTML={{ __html: bonus.parts[2].question }}
                />
              ) : (
                <p className="text-center text-base sm:text-lg md:text-xl font-medium animate-pulse tracking-wide px-2" style={{ color: '#7f1d1d' }}>
                  👆 Click to reveal question
                </p>
              )}
            </div>
          </button>

          {/* Answer - Blue */}
          {revealedQuestions.has(2) && (
            <button
              onClick={() => toggleAnswer(2)}
              className="w-full"
            >
              <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] ${
                revealedAnswers.has(2) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`} style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' }}>
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl">✅</span>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#ffffff' }}>Answer 3</h3>
                </div>
                {revealedAnswers.has(2) ? (
                  <div
                    className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-center tracking-wide px-2"
                    style={{ color: '#ffffff' }}
                    dangerouslySetInnerHTML={{ __html: bonus.parts[2].answer }}
                  />
                ) : (
                  <p className="text-center text-base sm:text-lg md:text-xl font-medium animate-pulse tracking-wide px-2" style={{ color: '#bfdbfe' }}>
                    👆 Click to reveal answer
                  </p>
                )}
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
