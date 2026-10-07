import React, { useState } from 'react';
import { Volume2, Copy, Check, Globe2, Sparkles, ArrowLeft } from 'lucide-react';
import { MultiLangResult } from '../types/translator';
import { playSpeech } from '../utils/speech';

interface MultiLangViewProps {
  initialWord: string;
  onSelectWordForDeepAnalysis: (word: string, targetLang: string) => void;
}

export const MultiLangView: React.FC<MultiLangViewProps> = ({
  initialWord,
  onSelectWordForDeepAnalysis,
}) => {
  const [word, setWord] = useState(initialWord || 'سلام');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MultiLangResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [playingLang, setPlayingLang] = useState<string | null>(null);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const fetchMultilingual = async (targetWord: string) => {
    if (!targetWord.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/translate/multilingual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord.trim(),
          sourceLang: 'auto',
          targetLangs: ['en', 'fr', 'es', 'de', 'tr', 'it', 'ru', 'ja', 'ko', 'zh', 'pt', 'hi', 'ur', 'id'],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'فشلت الترجمة متعددة اللغات');
      }

      const data = await res.json();
      setResults(data.results || []);
    } catch (e: any) {
      setError(e?.message || 'حدث خطأ في جلب الترجمة لجميع اللغات');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically if initial word is provided and results empty
  React.useEffect(() => {
    if (initialWord && results.length === 0) {
      setWord(initialWord);
      fetchMultilingual(initialWord);
    } else if (results.length === 0) {
      fetchMultilingual(word);
    }
  }, [initialWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMultilingual(word);
  };

  const handlePlay = async (text: string, langCode: string) => {
    if (playingLang) return;
    setPlayingLang(langCode);
    try {
      await playSpeech(text, langCode);
    } finally {
      setPlayingLang(null);
    }
  };

  const handleCopy = (text: string, langCode: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLang(langCode);
    setTimeout(() => setCopiedLang(null), 1800);
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Intro Header */}
      <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-3 text-right">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1">
          <Globe2 className="w-4 h-4" />
          <span>الترجمة المقارنة عبر 14 لغة عالمية</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          اكتب أي كلمة لمشاهدة ونطق ترجمتها الفورية في أشهر لغات العالم في شاشة واحدة.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-slate-800/90 rounded-2xl border border-slate-700/80 focus-within:border-indigo-500 overflow-hidden">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="اكتب كلمة لترجمتها لكل اللغات..."
            className="w-full bg-transparent text-slate-100 text-sm py-3 px-4 focus:outline-none text-right font-medium"
          />
          <button
            type="submit"
            disabled={loading || !word.trim()}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>ترجم للكل</span>
                <Sparkles className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
          {error}
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
        {results.map((res) => (
          <div
            key={res.langCode}
            className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3 transition-all flex flex-col justify-between gap-2 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{res.flag || '🌐'}</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">{res.langName}</div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{res.langCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePlay(res.translation, res.langCode)}
                  className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors ${
                    playingLang === res.langCode ? 'text-indigo-400 animate-pulse' : ''
                  }`}
                  title="نطق الكلمة"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCopy(res.translation, res.langCode)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors"
                  title="نسخ"
                >
                  {copiedLang === res.langCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base font-bold text-white tracking-wide">{res.translation}</div>
              {res.phonetic && (
                <div className="text-[11px] text-indigo-300 font-mono" dir="ltr">
                  {res.phonetic}
                </div>
              )}
            </div>

            <button
              onClick={() => onSelectWordForDeepAnalysis(word, res.langCode)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center justify-end gap-1 pt-1.5 border-t border-slate-700/40 transition-colors"
            >
              <span>تحليل القاموس الكامل</span>
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
