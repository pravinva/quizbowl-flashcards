'use client';

import { useState } from 'react';

export interface FilterOptions {
  minYear: number;
  maxYear: number;
  difficultyLevel: 'all' | 'easy' | 'medium' | 'hard';
}

interface BonusFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function BonusFilters({ onFilterChange }: BonusFiltersProps) {
  const currentYear = new Date().getFullYear();
  const [minYear, setMinYear] = useState(2010);
  const [maxYear, setMaxYear] = useState(currentYear);
  const [difficultyLevel, setDifficultyLevel] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({ minYear, maxYear, difficultyLevel });
  };

  const handleReset = () => {
    setMinYear(2010);
    setMaxYear(currentYear);
    setDifficultyLevel('all');
    onFilterChange({ minYear: 2010, maxYear: currentYear, difficultyLevel: 'all' });
  };

  return (
    <div className="backdrop-blur-sm bg-white/50 rounded-2xl p-4 border border-gray-200 shadow-lg">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex justify-between items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
      >
        <span>🎯 Filters</span>
        <span>{showFilters ? '▲' : '▼'}</span>
      </button>

      {showFilters && (
        <div className="mt-4 space-y-4">
          {/* Year Range */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#1e40af' }}>
              Year Range: {minYear} - {maxYear}
            </label>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <input
                  type="range"
                  min="2010"
                  max={currentYear}
                  value={minYear}
                  onChange={(e) => setMinYear(Math.min(Number(e.target.value), maxYear))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    accentColor: '#2563eb',
                  }}
                />
                <div className="text-xs text-center mt-1" style={{ color: '#3b82f6' }}>Min: {minYear}</div>
              </div>
              <div className="flex-1">
                <input
                  type="range"
                  min="2010"
                  max={currentYear}
                  value={maxYear}
                  onChange={(e) => setMaxYear(Math.max(Number(e.target.value), minYear))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    accentColor: '#2563eb',
                  }}
                />
                <div className="text-xs text-center mt-1" style={{ color: '#3b82f6' }}>Max: {maxYear}</div>
              </div>
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#1e40af' }}>
              Difficulty Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setDifficultyLevel('all')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  difficultyLevel === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500'
                }`}
              >
                All Levels
              </button>
              <button
                onClick={() => setDifficultyLevel('easy')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  difficultyLevel === 'easy'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500'
                }`}
              >
                🟢 Easy/HS
              </button>
              <button
                onClick={() => setDifficultyLevel('medium')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  difficultyLevel === 'medium'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-500'
                }`}
              >
                🟡 Medium
              </button>
              <button
                onClick={() => setDifficultyLevel('hard')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  difficultyLevel === 'hard'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500'
                }`}
              >
                🔴 Hard/College
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {difficultyLevel === 'easy' && '• Difficulty 1-4: Novice, Middle School, High School'}
              {difficultyLevel === 'medium' && '• Difficulty 5-7: Challenging HS, easier College'}
              {difficultyLevel === 'hard' && '• Difficulty 8-10: College, Open tournaments'}
              {difficultyLevel === 'all' && '• All difficulty levels included'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all transform hover:scale-105"
            >
              ✓ Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white text-gray-700 rounded-xl font-bold border-2 border-gray-300 hover:border-red-500 transition-all transform hover:scale-105"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
