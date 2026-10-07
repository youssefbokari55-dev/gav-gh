import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, ArrowLeft, Lightbulb } from 'lucide-react';
import { WordOfTheDay } from '../types/translator';
import { playSpeech } from '../utils/speech';

interface WordOfTheDayCardProps {
  onExploreWord: (word: string) => void;
}

export const WordOfTheDayCard: React.FC<WordOfTheDayCardProps> = ({ onExploreWord }) => {
  const [data, setData] = useState<WordOfTheDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/word-of-the-day?targetLang=ar')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-800/40 border border-slate-750/60 rounded-2xl p-4 animate-pulse my-2">
        <div className="h-4 bg-slate-700/60 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-slate-700/60 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-slate-700/60 rounded w-1/2"></div>
      </div>
    );
  }

  if (!data) return null;

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) return;
    setPlaying(true);
    try {
      await playSpeech(data.word, 'en');
    } finally {
      setPlaying(false);
    }
  };

  return (
    <div
      onClick={() => onExploreWord(data.word)}
      className="w-full bg-gradient-to-r from-indigo-950/50 via-slate-900 to-sky-950/30 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl p-3.5 my-2 cursor-pointer transition-all shadow-md group relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>كلمة اليوم اللغوية</span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
          {data.sourceLang}
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-white font-sans">{data.word}</span>
            {data.phonetic && (
              <span className="text-[11px] text-indigo-300 font-mono" dir="ltr">
                {data.phonetic}
              </span>
            )}
            <button
              onClick={handlePlay}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
              title="استمع"
            >
              <Volume2 className={`w-3.5 h-3.5 ${playing ? 'text-indigo-400 animate-pulse' : ''}`} />
            </button>
          </div>
          <div className="text-xs font-semibold text-slate-200 mt-0.5">
            {data.translation}
          </div>
        </div>

        <div className="text-[11px] text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 flex-shrink-0 font-medium">
          <span>اكتشف المزيد</span>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        </div>
      </div>

      {data.funFact && (
        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-[11px] text-slate-400 leading-relaxed">
          <Lightbulb className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{data.funFact}</span>
        </div>
      )}
    </div>
  );
};
