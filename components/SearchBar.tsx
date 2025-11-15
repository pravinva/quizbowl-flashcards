'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, useSemanticSearch: boolean) => void;
  onClear: () => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, onClear, placeholder = 'Ask anything... e.g., "baroque musicians from France"' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [semanticMode, setSemanticMode] = useState(true);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      onSearch(value.trim(), semanticMode);
      setIsActive(true);
    } else if (value.trim().length === 0) {
      handleClear();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      onSearch(query.trim(), semanticMode);
      setIsActive(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsActive(false);
    onClear();
  };

  const toggleMode = () => {
    setSemanticMode(!semanticMode);
    if (isActive && query.trim().length >= 2) {
      onSearch(query.trim(), !semanticMode);
    }
  };

  return (
    <div className="relative">
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 sm:p-4 rounded-xl border-2 transition-all ${
        isActive
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-200 bg-white hover:border-purple-400'
      }`}>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl sm:text-2xl">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full outline-none bg-transparent font-medium text-base sm:text-base min-h-[40px] sm:min-h-0"
            style={{
              color: '#1f2937',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '16px'
            }}
          />
        </div>
        <div className="flex items-center gap-2 justify-end sm:justify-start">
          <button
            onClick={toggleMode}
            className={`px-4 py-2.5 sm:px-3 sm:py-1.5 text-sm sm:text-xs font-bold rounded-lg transition-all ${
              semanticMode
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={semanticMode ? 'Using AI semantic search' : 'Using keyword search'}
          >
            {semanticMode ? '🧠 AI' : '📝 Text'}
          </button>
          {isActive && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 sm:px-3 sm:py-1.5 bg-red-500 text-white text-sm sm:text-xs font-bold rounded-lg hover:bg-red-600 transition-all"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {isActive && (
        <div className="mt-2 p-4 sm:p-3 bg-purple-100 border-2 border-purple-500 rounded-lg">
          <p className="text-base sm:text-sm font-bold" style={{ color: '#7c3aed', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {semanticMode ? '🧠 AI Semantic Search' : '📝 Keyword Search'}: "{query}"
          </p>
          <p className="text-sm sm:text-xs mt-1" style={{ color: '#6b7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {semanticMode
              ? 'Understanding meaning and context of your query...'
              : 'Searching for exact keyword matches...'}
          </p>
        </div>
      )}
    </div>
  );
}
