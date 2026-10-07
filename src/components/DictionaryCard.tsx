import React, { useState } from 'react';
import { Volume2, Bookmark, Check, Copy, Sparkles, BookOpen, Layers, Lightbulb, ArrowUpRight } from 'lucide-react';
import { WordTranslationResult } from '../types/translator';
import { playSpeech } from '../utils/speech';

interface DictionaryCardProps {
  result: WordTranslationResult;
  isSaved: boolean;
  onToggleSave: () => void;
  onSearchWord: (word: string) => void;
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({
  result,
  isSaved,
  onToggleSave,
  onSearchWord,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePlayWord = async (text: string, langCode: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      await playSpeech(text, langCode);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handlePlaySentence = async (sentence: string, idx: number) => {
    if (playingSentenceIdx !== null) return;
    setPlayingSentenceIdx(idx);
    try {
      await playSpeech(sentence, result.sourceLang);
    } finally {
      setPlayingSentenceIdx(null);
    }
  };

  const handleCopy = () => {
    const textToCopy = `${result.word} ➔ ${result.primaryTranslation}\nنطق: ${result.phonetic || ''}\nنوع الكلمة: ${result.partOfSpeech}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-3 my-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Main Translation Spotlight Card */}
      <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top actions & Word metadata */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
              {result.partOfSpeech}
            </span>
            {result.detectedSourceLang && (
              <span className="text-[11px] text-slate-400">
                من: {result.detectedSourceLang}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="نسخ الترجمة"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleSave}
              className={`p-1.5 rounded-lg transition-all ${
                isSaved
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
              title={isSaved ? 'محفوظة في دفتر المفردات' : 'حفظ الكلمة'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Primary Translation & Original Word */}
        <div className="my-2 text-right">
          <div className="text-2xl font-bold text-white tracking-tight leading-snug flex items-center justify-between">
            <span>{result.primaryTranslation}</span>
            <button
              onClick={() => handlePlayWord(result.primaryTranslation, result.targetLang)}
              className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all active:scale-95 border border-indigo-500/30 flex items-center gap-1.5 text-xs font-medium"
              title="استمع للنطق المترجم"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-indigo-200' : ''}`} />
              <span className="text-[10px]">استمع</span>
            </button>
          </div>

          {/* Original Word + Phonetics */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
            <span className="font-medium text-slate-400">الأصل:</span>
            <span className="font-semibold text-slate-200 font-sans text-sm">{result.word}</span>
            {result.phonetic && (
              <span className="text-[11px] text-indigo-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60" dir="ltr">
                {result.phonetic}
              </span>
            )}
            <button
              onClick={() => handlePlayWord(result.word, result.sourceLang)}
              className="text-slate-400 hover:text-indigo-400 p-1 rounded transition-colors"
              title="نطق الكلمة الأصلية"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Definitions list */}
        {result.definitions && result.definitions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>المعاني والتعريفات:</span>
            </div>
            <ul className="space-y-1 pr-4 list-disc list-outside text-xs text-slate-200 leading-relaxed marker:text-indigo-500">
              {result.definitions.map((def, idx) => (
                <li key={idx}>{def}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Alternative Translations / Nuances */}
      {result.alternativeTranslations && result.alternativeTranslations.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3.5">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>ترجمات بديلة وسياقات الاستخدام:</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {result.alternativeTranslations.map((alt, idx) => (
              <div
                key={idx}
                className="flex items-baseline justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span>{alt.translation}</span>
                  {alt.partOfSpeech && (
                    <span className="text-[10px] text-slate-500 font-normal">({alt.partOfSpeech})</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 max-w-[55%] text-left">
                  {alt.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-World Context Examples */}
      {result.examples && result.examples.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3.5">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>أمثلة سياقية واقعية:</span>
          </div>
          <div className="space-y-2">
            {result.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-slate-200 leading-snug font-sans text-left" dir="ltr">
                    "{ex.sourceSentence}"
                  </p>
                  <button
                    onClick={() => handlePlaySentence(ex.sourceSentence, idx)}
                    className="p-1 text-slate-400 hover:text-indigo-400 rounded transition-colors flex-shrink-0"
                    title="استمع للمثال"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${playingSentenceIdx === idx ? 'text-indigo-400 animate-pulse' : ''}`} />
                  </button>
                </div>
                <p className="text-slate-400 text-right pr-2 border-r-2 border-indigo-500/50">
                  {ex.targetSentence}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Synonyms & Antonyms (Clickable chips to re-search) */}
      {((result.synonyms && result.synonyms.length > 0) || (result.antonyms && result.antonyms.length > 0)) && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3.5">
          {result.synonyms && result.synonyms.length > 0 && (
            <div className="mb-2.5">
              <div className="text-xs font-semibold text-slate-300 mb-1.5">المرادفات (Synonyms):</div>
              <div className="flex flex-wrap gap-1.5">
                {result.synonyms.map((syn, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSearchWord(syn)}
                    className="px-2.5 py-1 bg-slate-900/90 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 rounded-lg text-xs border border-slate-700/50 transition-colors flex items-center gap-1 group"
                  >
                    <span>{syn}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {result.antonyms && result.antonyms.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-1.5">الأضداد (Antonyms):</div>
              <div className="flex flex-wrap gap-1.5">
                {result.antonyms.map((ant, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSearchWord(ant)}
                    className="px-2.5 py-1 bg-slate-900/90 hover:bg-rose-900/30 text-slate-300 hover:text-rose-200 rounded-lg text-xs border border-slate-700/50 transition-colors flex items-center gap-1 group"
                  >
                    <span>{ant}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-rose-300" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grammar & Morphological Notes */}
      {result.grammarNotes && (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-200">فائدة نحوية ولغوية: </span>
            {result.grammarNotes}
          </div>
        </div>
      )}

      {/* Cultural Nuance */}
      {result.culturalContext && (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-200">إضاءة ثقافية: </span>
            {result.culturalContext}
          </div>
        </div>
      )}
    </div>
  );
};
