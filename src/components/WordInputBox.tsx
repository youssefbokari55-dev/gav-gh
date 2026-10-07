import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X, Clipboard, ArrowLeft, Sparkles } from 'lucide-react';
import { isSpeechRecognitionSupported, startSpeechRecognition } from '../utils/speech';

interface WordInputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (word: string) => void;
  isLoading: boolean;
  sourceLangCode: string;
}

const SAMPLE_WORDS = [
  'نور',
  'Courage',
  'Meraki',
  'Gratitude',
  'Komorebi',
  'الصداقة',
  'Serendipity',
  'Esperanza',
];

export const WordInputBox: React.FC<WordInputBoxProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  sourceLangCode,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    const recognition = startSpeechRecognition(sourceLangCode, {
      onResult: (transcript) => {
        onChange(transcript);
        setIsListening(false);
        onSubmit(transcript);
      },
      onError: (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (recognition) {
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text.trim());
        inputRef.current?.focus();
      }
    } catch {}
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 my-2">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center bg-slate-800/80 rounded-2xl border transition-all ${
            isLoading
              ? 'border-indigo-500/50 ring-2 ring-indigo-500/20'
              : 'border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
          }`}
        >
          {/* Main text input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="اكتب كلمة أو مصطلحاً للترجمة والتحليل..."
            disabled={isLoading}
            className="w-full bg-transparent text-slate-100 text-sm py-3.5 pr-4 pl-24 focus:outline-none placeholder:text-slate-500 text-right font-medium"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          {/* Action buttons inside the right/left of the input */}
          <div className="absolute left-2.5 flex items-center gap-1">
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  inputRef.current?.focus();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/60 transition-colors"
                title="مسح"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {!value && (
              <button
                type="button"
                onClick={handlePaste}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/60 transition-colors"
                title="لصق من الحافظة"
              >
                <Clipboard className="w-4 h-4" />
              </button>
            )}

            {isSpeechRecognitionSupported() && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60'
                }`}
                title={isListening ? 'جارٍ الاستماع... انقر للإيقاف' : 'إدخال صوتي'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Translate submit button */}
            <button
              type="submit"
              disabled={isLoading || !value.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center active:scale-95"
              title="ترجمة"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Voice listening status indicator */}
      {isListening && (
        <div className="flex items-center justify-center gap-2 py-1.5 px-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>الميكروفون نشط.. تحدث بالكلمة الآن</span>
        </div>
      )}

      {/* Voice error notice */}
      {speechError && (
        <div className="text-[11px] text-amber-400 text-center bg-amber-500/10 rounded-lg p-1.5 border border-amber-500/20">
          تنبيه: {speechError}
        </div>
      )}

      {/* Quick sample words chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>أمثلة:</span>
        </span>
        {SAMPLE_WORDS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => {
              onChange(w);
              onSubmit(w);
            }}
            className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs whitespace-nowrap transition-colors border border-slate-700/40"
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
};
