import React from 'react';
import { ArrowLeftRight, ChevronDown } from 'lucide-react';
import { Language } from '../types/translator';

interface LanguageSelectorBarProps {
  sourceLang: Language;
  targetLang: Language;
  onSelectSource: () => void;
  onSelectTarget: () => void;
  onSwapLanguages: () => void;
}

export const LanguageSelectorBar: React.FC<LanguageSelectorBarProps> = ({
  sourceLang,
  targetLang,
  onSelectSource,
  onSelectTarget,
  onSwapLanguages,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2 bg-slate-800/60 rounded-2xl border border-slate-700/50 my-2">
      {/* Source Language Button */}
      <button
        type="button"
        onClick={onSelectSource}
        className="flex-1 flex items-center justify-between gap-1.5 px-3 py-2 bg-slate-900/80 hover:bg-slate-900 rounded-xl text-right transition-all border border-slate-700/40 text-slate-200 hover:border-indigo-500/40"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-lg">{sourceLang.flag}</span>
          <span className="text-xs font-semibold text-slate-100 truncate">
            {sourceLang.name}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      </button>

      {/* Swap Button */}
      <button
        type="button"
        onClick={onSwapLanguages}
        disabled={sourceLang.code === 'auto'}
        title={sourceLang.code === 'auto' ? 'لا يمكن التبديل مع الاكتشاف التلقائي' : 'تبديل اللغات'}
        className={`p-2 rounded-xl transition-all ${
          sourceLang.code === 'auto'
            ? 'opacity-40 cursor-not-allowed text-slate-500'
            : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 active:scale-90'
        }`}
      >
        <ArrowLeftRight className="w-4 h-4" />
      </button>

      {/* Target Language Button */}
      <button
        type="button"
        onClick={onSelectTarget}
        className="flex-1 flex items-center justify-between gap-1.5 px-3 py-2 bg-slate-900/80 hover:bg-slate-900 rounded-xl text-right transition-all border border-slate-700/40 text-slate-200 hover:border-indigo-500/40"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-lg">{targetLang.flag}</span>
          <span className="text-xs font-semibold text-slate-100 truncate">
            {targetLang.name}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      </button>
    </div>
  );
};
