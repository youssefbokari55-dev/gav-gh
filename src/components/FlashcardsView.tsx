import React, { useState } from 'react';
import { Volume2, CheckCircle2, RotateCcw, Trash2, BookOpen, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { SavedWord } from '../types/translator';
import { playSpeech } from '../utils/speech';

interface FlashcardsViewProps {
  savedWords: SavedWord[];
  onToggleMastered: (id: string) => void;
  onRemoveWord: (id: string) => void;
  onSelectWord: (word: string, targetLang: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  savedWords,
  onToggleMastered,
  onRemoveWord,
  onSelectWord,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unmastered' | 'mastered'>('all');

  const filteredWords = savedWords.filter((w) => {
    if (filter === 'unmastered') return !w.mastered;
    if (filter === 'mastered') return w.mastered;
    return true;
  });

  const currentWord = filteredWords[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < filteredWords.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredWords.length - 1));
  };

  const handlePlay = (e: React.MouseEvent, text: string, lang: string) => {
    e.stopPropagation();
    playSpeech(text, lang);
  };

  if (savedWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-base text-white mb-1">دفتر المفردات فارغ</h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          قم بترجمة أي كلمة واضغط على أيقونة الحفظ (🔖) لتتمكن من مراجعتها وتثبيتها بالبطاقات التعليمية هنا.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Top Filter & Progress */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <button
            onClick={() => { setFilter('all'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الكل ({savedWords.length})
          </button>
          <button
            onClick={() => { setFilter('unmastered'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'unmastered' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            للمراجعة ({savedWords.filter((w) => !w.mastered).length})
          </button>
          <button
            onClick={() => { setFilter('mastered'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'mastered' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المتقنة ({savedWords.filter((w) => w.mastered).length})
          </button>
        </div>

        {filteredWords.length > 0 && (
          <span className="text-slate-400 font-mono text-xs">
            {currentIndex + 1} / {filteredWords.length}
          </span>
        )}
      </div>

      {filteredWords.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-400">
          لا توجد كلمات في هذا التصنيف حالياً.
        </div>
      ) : (
        <>
          {/* Flip Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] bg-gradient-to-br from-slate-850 via-slate-900 to-indigo-950/40 border border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between items-center text-center cursor-pointer shadow-xl relative transition-all hover:border-indigo-500/40 select-none group"
          >
            {/* Top card bar */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-indigo-400 border border-slate-700">
                {currentWord.partOfSpeech || 'مفردة'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMastered(currentWord.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  currentWord.mastered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{currentWord.mastered ? 'تم إتقانها' : 'تحديد كمتقنة'}</span>
              </button>
            </div>

            {/* Center Content: Front (Source Word) or Back (Translation) */}
            <div className="my-auto py-4 flex flex-col items-center">
              {!isFlipped ? (
                <>
                  <div className="text-3xl font-extrabold text-white tracking-tight mb-2 font-sans">
                    {currentWord.sourceWord}
                  </div>
                  {currentWord.phonetic && (
                    <div className="text-xs text-indigo-300 font-mono mb-3" dir="ltr">
                      {currentWord.phonetic}
                    </div>
                  )}
                  <button
                    onClick={(e) => handlePlay(e, currentWord.sourceWord, currentWord.sourceLang)}
                    className="p-2 rounded-full bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                    title="استمع"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3 text-indigo-400" />
                    <span>المس البطاقة للكشف عن الترجمة</span>
                  </p>
                </>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
                  <span className="text-xs text-slate-400 mb-1">الترجمة:</span>
                  <div className="text-3xl font-bold text-white mb-2">
                    {currentWord.targetWord}
                  </div>
                  <button
                    onClick={(e) => handlePlay(e, currentWord.targetWord, currentWord.targetLang)}
                    className="p-2 rounded-full bg-indigo-600 text-white transition-colors mb-2"
                    title="استمع للترجمة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {currentWord.exampleSentence && (
                    <p className="text-xs text-slate-300 max-w-xs mt-2 italic bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
                      "{currentWord.exampleSentence}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom tools */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectWord(currentWord.sourceWord, currentWord.targetLang);
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>فتح القاموس</span>
                <Sparkles className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveWord(currentWord.id);
                }}
                className="text-slate-500 hover:text-rose-400 p-1 rounded"
                title="حذف من المفردات"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 mt-1">
            <button
              onClick={handlePrev}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/20"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
