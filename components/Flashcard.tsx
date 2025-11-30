'use client';

import { useState, useEffect, useRef } from 'react';
import type { Bonus } from '@/types/quizbowl';

interface FlashcardProps {
  bonus: Bonus;
}

// Helper function to strip HTML tags and get plain text
function stripHtml(html: string): string {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Get neutral American English voice
function getAmericanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null;
  }
  
  const voices = window.speechSynthesis.getVoices();
  // Prefer US English voices, prioritize neutral-sounding ones
  const preferredVoices = [
    'en-US',
    'en_US',
    'Google US English',
    'Microsoft Zira - English (United States)',
    'Alex',
    'Samantha'
  ];
  
  // Try to find a preferred voice
  for (const preferred of preferredVoices) {
    const voice = voices.find(v => 
      v.lang.startsWith('en-US') && 
      (v.name.includes(preferred) || v.name === preferred)
    );
    if (voice) return voice;
  }
  
  // Fallback to any US English voice
  const usVoice = voices.find(v => v.lang.startsWith('en-US'));
  if (usVoice) return usVoice;
  
  // Fallback to any English voice
  return voices.find(v => v.lang.startsWith('en')) || null;
}

// Streaming text hook with optional synchronized TTS
function useStreamingText(text: string, enabled: boolean, speed: number = 100, useTTS: boolean = false) {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const speechQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef<boolean>(false);
  const currentTextRef = useRef<string>('');

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    // Stop speech if TTS is disabled
    if (!useTTS && synthRef.current) {
      synthRef.current.cancel();
      speechQueueRef.current = [];
      isSpeakingRef.current = false;
    }

    if (!enabled) {
      setDisplayedText('');
      setIsStreaming(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Stop any ongoing speech
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      speechQueueRef.current = [];
      isSpeakingRef.current = false;
      return;
    }

    setIsStreaming(true);
    setDisplayedText('');
    const plainText = stripHtml(text);
    
    // Split text into words for word-by-word streaming
    const words = plainText.split(/(\s+)/).filter(w => w.trim().length > 0);
    let wordIndex = 0;
    let currentText = '';
    let streamingStarted = false;
    
    // Reset speech state
    isSpeakingRef.current = false;

    const speakContinuously = (textToSpeak: string) => {
      if (!synthRef.current || !textToSpeak.trim() || isSpeakingRef.current) return;
      
      isSpeakingRef.current = true;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voice = getAmericanVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = 'en-US';
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        isSpeakingRef.current = false;
      };
      
      utterance.onerror = () => {
        isSpeakingRef.current = false;
      };
      
      synthRef.current.speak(utterance);
    };

    const startStreaming = () => {
      streamingStarted = true;
      stream();
    };

    const stream = () => {
      if (wordIndex < words.length) {
        // Add next word
        const word = words[wordIndex];
        currentText += word + ' ';
        const displayText = currentText.trim();
        currentTextRef.current = displayText; // Update ref for callback access
        setDisplayedText(displayText);
        
        wordIndex++;
        // Calculate delay for 170 WPM: 60,000ms / 170 words = 353ms per word
        // Adjust slightly based on word length for natural pacing
        const wordLength = word.length;
        const baseDelay = speed; // speed should be ~353ms for 170 WPM
        const delay = baseDelay + (wordLength > 8 ? wordLength * 1 : 0); // Minimal adjustment for very long words
        timeoutRef.current = setTimeout(stream, delay);
      } else {
        setIsStreaming(false);
      }
    };

    // If TTS is enabled, start speaking first, then start streaming after 5 words
    if (useTTS && plainText.trim()) {
      // Start speaking the full text immediately
      speakContinuously(plainText);
      
      // Calculate time for 5 words to be spoken
      // Average speech rate: ~150 WPM at rate 1.0
      // 5 words at 150 WPM = (5 / 150) * 60,000ms = 2,000ms
      const wordsToWait = 5;
      const averageWordsPerMinute = 150; // Standard reading speed
      const delayFor5Words = (wordsToWait / averageWordsPerMinute) * 60 * 1000; // ~2000ms
      
      // Start streaming after 5 words have been spoken
      setTimeout(() => {
        if (!streamingStarted) {
          startStreaming();
        }
      }, delayFor5Words);
    } else {
      // If TTS is disabled, start streaming immediately
      startStreaming();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      speechQueueRef.current = [];
      isSpeakingRef.current = false;
    };
  }, [text, enabled, speed, useTTS]);

  return { displayedText, isStreaming };
}

export default function Flashcard({ bonus }: FlashcardProps) {
  const [revealedQuestions, setRevealedQuestions] = useState<Set<number>>(new Set());
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [readAloudEnabled, setReadAloudEnabled] = useState(false);
  
  // Streaming states for each question part
  // Speed: 353ms per word = 170 WPM (60,000ms / 170 words = 353ms)
  const streamingQuestion1 = useStreamingText(
    bonus.parts[0]?.question || '',
    revealedQuestions.has(0),
    353,
    readAloudEnabled
  );
  const streamingQuestion2 = useStreamingText(
    bonus.parts[1]?.question || '',
    revealedQuestions.has(1),
    353,
    readAloudEnabled
  );
  const streamingQuestion3 = useStreamingText(
    bonus.parts[2]?.question || '',
    revealedQuestions.has(2),
    353,
    readAloudEnabled
  );

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
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
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
          <button
            onClick={() => setReadAloudEnabled(!readAloudEnabled)}
            className={`flex-1 sm:flex-none px-3 py-2 sm:px-5 sm:py-2.5 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
              readAloudEnabled
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
            }`}
          >
            {readAloudEnabled ? '🔊 Reading Aloud' : '🔇 Read Aloud'}
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
            <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col ${revealedQuestions.has(0) ? 'items-start' : 'items-center'} justify-center min-h-[180px] sm:min-h-[200px] ${
              revealedQuestions.has(0) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#bfdbfe' }}>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl">❓</span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#1e3a8a' }}>Part 1 • {bonus.parts[0].value} points</h3>
              </div>
              {revealedQuestions.has(0) ? (
                <div
                  className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-left tracking-wide px-2 w-full"
                  style={{ color: '#1e3a8a' }}
                >
                  {streamingQuestion1.displayedText}
                  {streamingQuestion1.isStreaming && (
                    <span className="animate-pulse">|</span>
                  )}
                </div>
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
            <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col ${revealedQuestions.has(1) ? 'items-start' : 'items-center'} justify-center min-h-[180px] sm:min-h-[200px] ${
              revealedQuestions.has(1) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#bbf7d0' }}>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl">❓</span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#14532d' }}>Part 2 • {bonus.parts[1].value} points</h3>
              </div>
              {revealedQuestions.has(1) ? (
                <div
                  className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-left tracking-wide px-2 w-full"
                  style={{ color: '#14532d' }}
                >
                  {streamingQuestion2.displayedText}
                  {streamingQuestion2.isStreaming && (
                    <span className="animate-pulse">|</span>
                  )}
                </div>
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
            <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl transition-all transform flex flex-col ${revealedQuestions.has(2) ? 'items-start' : 'items-center'} justify-center min-h-[180px] sm:min-h-[200px] ${
              revealedQuestions.has(2) ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`} style={{ backgroundColor: '#fecaca' }}>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl">❓</span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#7f1d1d' }}>Part 3 • {bonus.parts[2].value} points</h3>
              </div>
              {revealedQuestions.has(2) ? (
                <div
                  className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-left tracking-wide px-2 w-full"
                  style={{ color: '#7f1d1d' }}
                >
                  {streamingQuestion3.displayedText}
                  {streamingQuestion3.isStreaming && (
                    <span className="animate-pulse">|</span>
                  )}
                </div>
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
