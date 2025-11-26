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

  // Pending filters (what user has selected but not applied)
  const [pendingMinYear, setPendingMinYear] = useState(2022);
  const [pendingMaxYear, setPendingMaxYear] = useState(currentYear);
  const [pendingDifficulty, setPendingDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Applied filters (what's actually filtering the data)
  const [appliedMinYear, setAppliedMinYear] = useState(2022);
  const [appliedMaxYear, setAppliedMaxYear] = useState(currentYear);
  const [appliedDifficulty, setAppliedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const [showFilters, setShowFilters] = useState(false);

  const hasUnappliedChanges =
    pendingMinYear !== appliedMinYear ||
    pendingMaxYear !== appliedMaxYear ||
    pendingDifficulty !== appliedDifficulty;

  const handleApplyFilters = () => {
    setAppliedMinYear(pendingMinYear);
    setAppliedMaxYear(pendingMaxYear);
    setAppliedDifficulty(pendingDifficulty);
    onFilterChange({ minYear: pendingMinYear, maxYear: pendingMaxYear, difficultyLevel: pendingDifficulty });
  };

  const handleReset = () => {
    setPendingMinYear(2022);
    setPendingMaxYear(currentYear);
    setPendingDifficulty('all');
    setAppliedMinYear(2022);
    setAppliedMaxYear(currentYear);
    setAppliedDifficulty('all');
    onFilterChange({ minYear: 2022, maxYear: currentYear, difficultyLevel: 'all' });
  };

  return (
    <div className="backdrop-blur-sm bg-white/80 rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span>Filters</span>
          {hasUnappliedChanges && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full animate-pulse">
              Changes Pending
            </span>
          )}
        </span>
        <span className="text-xl">{showFilters ? '▲' : '▼'}</span>
      </button>

      {showFilters && (
        <div className="p-6 space-y-6">
          {/* Year Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-base font-bold" style={{ color: '#1e40af', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                📅 Year Range
              </label>
              <span className="text-base font-bold" style={{ color: '#2563eb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {pendingMinYear} - {pendingMaxYear}
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="2022"
                max={currentYear}
                value={pendingMinYear}
                onChange={(e) => setPendingMinYear(Math.min(Number(e.target.value), pendingMaxYear))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#2563eb' }}
              />
              <input
                type="range"
                min="2022"
                max={currentYear}
                value={pendingMaxYear}
                onChange={(e) => setPendingMaxYear(Math.max(Number(e.target.value), pendingMinYear))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#2563eb' }}
              />
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <label className="text-base font-bold" style={{ color: '#1e40af', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              🎓 Difficulty Level
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all bg-white">
                <input
                  type="radio"
                  name="difficulty"
                  value="all"
                  checked={pendingDifficulty === 'all'}
                  onChange={() => setPendingDifficulty('all')}
                  className="w-5 h-5"
                  style={{ accentColor: '#2563eb' }}
                />
                <div className="flex-1">
                  <div className="font-bold text-base" style={{ color: '#1f2937', fontFamily: 'system-ui, -apple-system, sans-serif' }}>All Levels</div>
                  <div className="text-sm font-medium" style={{ color: '#6b7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>No filtering • All tournaments</div>
                </div>
                {appliedDifficulty === 'all' && (
                  <span className="font-bold text-xl" style={{ color: '#10b981' }}>✓</span>
                )}
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 cursor-pointer transition-all bg-white">
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  checked={pendingDifficulty === 'easy'}
                  onChange={() => setPendingDifficulty('easy')}
                  className="w-5 h-5"
                  style={{ accentColor: '#10b981' }}
                />
                <div className="flex-1">
                  <div className="font-bold text-base" style={{ color: '#1f2937', fontFamily: 'system-ui, -apple-system, sans-serif' }}>🟢 Easy / High School</div>
                  <div className="text-sm font-medium" style={{ color: '#6b7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>Difficulty 1-4 • Novice, MS, HS</div>
                </div>
                {appliedDifficulty === 'easy' && (
                  <span className="font-bold text-xl" style={{ color: '#10b981' }}>✓</span>
                )}
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-yellow-400 cursor-pointer transition-all bg-white">
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  checked={pendingDifficulty === 'medium'}
                  onChange={() => setPendingDifficulty('medium')}
                  className="w-5 h-5"
                  style={{ accentColor: '#f59e0b' }}
                />
                <div className="flex-1">
                  <div className="font-bold text-base" style={{ color: '#1f2937', fontFamily: 'system-ui, -apple-system, sans-serif' }}>🟡 Medium</div>
                  <div className="text-sm font-medium" style={{ color: '#6b7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>Difficulty 5-7 • Challenging HS, easier College</div>
                </div>
                {appliedDifficulty === 'medium' && (
                  <span className="font-bold text-xl" style={{ color: '#10b981' }}>✓</span>
                )}
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-red-400 cursor-pointer transition-all bg-white">
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  checked={pendingDifficulty === 'hard'}
                  onChange={() => setPendingDifficulty('hard')}
                  className="w-5 h-5"
                  style={{ accentColor: '#ef4444' }}
                />
                <div className="flex-1">
                  <div className="font-bold text-base" style={{ color: '#1f2937', fontFamily: 'system-ui, -apple-system, sans-serif' }}>🔴 Hard / College</div>
                  <div className="text-sm font-medium" style={{ color: '#6b7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>Difficulty 8-10 • College, Open</div>
                </div>
                {appliedDifficulty === 'hard' && (
                  <span className="font-bold text-xl" style={{ color: '#10b981' }}>✓</span>
                )}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleApplyFilters}
              disabled={!hasUnappliedChanges}
              className={`flex-1 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                hasUnappliedChanges
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 animate-pulse'
                  : 'bg-blue-200 text-blue-600 cursor-not-allowed'
              }`}
            >
              {hasUnappliedChanges ? '⚠️ Apply Changes' : '✓ Filters Applied'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold border-2 border-blue-300 hover:border-red-500 hover:text-red-600 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
