import React from 'react';
import { BookOpen, History, Camera, Sparkles, Globe2, Smartphone } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenSaved: () => void;
  onOpenCamera: () => void;
  onOpenAndroidInfo: () => void;
  activeTab: 'dictionary' | 'multilingual' | 'flashcards';
  setActiveTab: (tab: 'dictionary' | 'multilingual' | 'flashcards') => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  historyCount,
  onOpenHistory,
  onOpenSaved,
  onOpenCamera,
  onOpenAndroidInfo,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="flex-none px-4 pt-2 pb-3 bg-slate-900/95 border-b border-slate-800/80 sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        {/* App Title & Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base text-white tracking-tight">مترجم الكلمات</h1>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold px-1.5 py-0.5 rounded border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">قاموس عالمي لجميع اللغات</p>
          </div>
        </div>

        {/* Action icons: Android install, Camera OCR, Saved Words, History */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenAndroidInfo}
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors relative"
            title="تثبيت ودعم أندرويد (Android)"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            onClick={onOpenCamera}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
            title="مسح كلمة بالكاميرا / صورة"
          >
            <Camera className="w-4 h-4 text-sky-400" />
          </button>

          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
            title="سجل البحث"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500"></span>
            )}
          </button>

          <button
            onClick={onOpenSaved}
            className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors relative"
            title="دفتر الكلمات المحفوظة"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            {savedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 flex items-center justify-center">
                {savedCount > 99 ? '99+' : savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Top Segmented Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'dictionary'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>قاموس الكلمة</span>
        </button>

        <button
          onClick={() => setActiveTab('multilingual')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'multilingual'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>كل اللغات</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'flashcards'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>حفظ و مراجعة</span>
        </button>
      </div>
    </header>
  );
};
