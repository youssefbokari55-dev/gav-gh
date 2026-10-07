import React, { useState } from 'react';
import { BookOpen, X, Trash2, Volume2, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { SavedWord } from '../types/translator';
import { playSpeech } from '../utils/speech';

interface SavedWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedWords: SavedWord[];
  onRemoveWord: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onSelectWord: (word: string, targetLang: string) => void;
  onStartStudy: () => void;
}

export const SavedWordsModal: React.FC<SavedWordsModalProps> = ({
  isOpen,
  onClose,
  savedWords,
  onRemoveWord,
  onToggleMastered,
  onSelectWord,
  onStartStudy,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = savedWords.filter(
    (w) =>
      w.sourceWord.toLowerCase().includes(search.toLowerCase()) ||
      w.targetWord.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              دفتر المفردات المحفوظة ({savedWords.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Study CTA Banner */}
        {savedWords.length > 0 && (
          <div className="p-3 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="text-right">
              <div className="text-xs font-bold text-white">جاهز لاختبار ذاكرتك؟</div>
              <div className="text-[11px] text-indigo-300">راجع مفرداتك ببطاقات التكرار المتباعد</div>
            </div>
            <button
              onClick={() => {
                onClose();
                onStartStudy();
              }}
              className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
            >
              <span>بدء المراجعة</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Search */}
        {savedWords.length > 0 && (
          <div className="p-3 border-b border-slate-800/80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الكلمات المحفوظة..."
              className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl py-2 px-3 border border-slate-800 focus:outline-none focus:border-indigo-500 text-right"
            />
          </div>
        )}

        {/* Words List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {savedWords.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              لم تقم بحفظ أي كلمات بعد. اضغط على أيقونة الحفظ (🔖) في بطاقة أي كلمة لإضافتها إلى دفترك.
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              لا توجد نتائج مطابقة لـ "{search}"
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-3 text-right"
              >
                <div
                  className="flex-1 cursor-pointer truncate"
                  onClick={() => {
                    onSelectWord(item.sourceWord, item.targetLang);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white font-sans">{item.sourceWord}</span>
                    {item.phonetic && (
                      <span className="text-[10px] text-indigo-300 font-mono" dir="ltr">
                        {item.phonetic}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">
                    {item.targetWord}
                  </div>
                  {item.exampleSentence && (
                    <div className="text-[10px] text-slate-400 truncate mt-1 italic">
                      "{item.exampleSentence}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => playSpeech(item.sourceWord, item.sourceLang)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="نطق"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleMastered(item.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.mastered ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-300'
                    }`}
                    title={item.mastered ? 'متقنة' : 'غير متقنة'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveWord(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
