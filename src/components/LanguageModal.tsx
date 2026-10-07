import React, { useState, useMemo } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { Language } from '../types/translator';
import { LANGUAGES, AUTO_DETECT_LANGUAGE } from '../data/languages';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lang: Language) => void;
  currentSelectedCode: string;
  allowAutoDetect?: boolean;
  title: string;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentSelectedCode,
  allowAutoDetect = false,
  title,
}) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'popular'>('popular');

  const filteredLanguages = useMemo(() => {
    let list = LANGUAGES;
    if (filterMode === 'popular' && !search.trim()) {
      list = LANGUAGES.filter((l) => l.popular);
    }

    if (!search.trim()) return list;

    const query = search.trim().toLowerCase();
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.englishName.toLowerCase().includes(query) ||
        l.nativeName.toLowerCase().includes(query) ||
        l.code.toLowerCase().includes(query)
    );
  }, [search, filterMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-slate-800/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن لغة (مثلاً: إنجليزية، French، 日本語)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl pr-9 pl-4 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500 text-right"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick tab filters */}
          {!search && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setFilterMode('popular')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterMode === 'popular'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                الأكثر شيوعاً
              </button>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterMode === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                جميع اللغات ({LANGUAGES.length})
              </button>
            </div>
          )}
        </div>

        {/* Languages List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {allowAutoDetect && !search && (
            <button
              onClick={() => {
                onSelect(AUTO_DETECT_LANGUAGE);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                currentSelectedCode === 'auto'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                  : 'hover:bg-slate-800/60 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">✨</span>
                <div className="text-right">
                  <div className="font-semibold text-xs text-white">اكتشاف تلقائي</div>
                  <div className="text-[11px] text-slate-400">التعرف على اللغة تلقائياً</div>
                </div>
              </div>
              {currentSelectedCode === 'auto' && <Check className="w-4 h-4 text-indigo-400" />}
            </button>
          )}

          {filteredLanguages.map((lang) => {
            const isSelected = currentSelectedCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelect(lang);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'hover:bg-slate-800/60 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl flex-shrink-0">{lang.flag}</span>
                  <div className="text-right">
                    <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5">
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({lang.nativeName})</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{lang.englishName}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              لم يتم العثور على لغة مطابقة لـ "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
