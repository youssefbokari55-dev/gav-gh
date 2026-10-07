import React, { useState, useEffect } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { LanguageSelectorBar } from './components/LanguageSelectorBar';
import { LanguageModal } from './components/LanguageModal';
import { WordInputBox } from './components/WordInputBox';
import { DictionaryCard } from './components/DictionaryCard';
import { MultiLangView } from './components/MultiLangView';
import { FlashcardsView } from './components/FlashcardsView';
import { HistoryModal } from './components/HistoryModal';
import { SavedWordsModal } from './components/SavedWordsModal';
import { CameraOcrModal } from './components/CameraOcrModal';
import { WordOfTheDayCard } from './components/WordOfTheDayCard';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { Language, WordTranslationResult, HistoryItem, SavedWord } from './types/translator';
import { getLanguageByCode } from './data/languages';
import {
  getSavedWords,
  saveWordToStorage,
  removeSavedWord,
  toggleWordMastered,
  isWordSaved,
  getHistory,
  addHistoryItem,
  clearHistory,
  getSavedPreferences,
  savePreferences,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'multilingual' | 'flashcards'>('dictionary');
  
  // Language selections
  const initialPrefs = getSavedPreferences();
  const [sourceLang, setSourceLang] = useState<Language>(getLanguageByCode(initialPrefs.sourceLang));
  const [targetLang, setTargetLang] = useState<Language>(getLanguageByCode(initialPrefs.targetLang));

  // Input & Result state
  const [inputText, setInputText] = useState('Courage');
  const [result, setResult] = useState<WordTranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Storage states
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Modals
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [langModalMode, setLangModalMode] = useState<'source' | 'target'>('source');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Load initial saved words & history on mount, and capture Android PWA install prompt
  useEffect(() => {
    setSavedWords(getSavedWords());
    setHistory(getHistory());

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Perform an initial translation for great first impression
    handleTranslate('Courage', sourceLang.code, targetLang.code);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleTranslate = async (
    wordToTranslate: string,
    sourceCode: string = sourceLang.code,
    targetCode: string = targetLang.code
  ) => {
    if (!wordToTranslate || !wordToTranslate.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/translate/word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: wordToTranslate.trim(),
          sourceLang: sourceCode,
          targetLang: targetCode,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'فشلت الترجمة');
      }

      const data: WordTranslationResult = await res.json();
      setResult(data);

      // Save to history
      addHistoryItem({
        word: data.word,
        translation: data.primaryTranslation,
        sourceLang: data.sourceLang,
        targetLang: data.targetLang,
      });
      setHistory(getHistory());
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ في جلب الترجمة. تحقق من الاتصال.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang.code === 'auto') return;

    const oldSource = sourceLang;
    const oldTarget = targetLang;
    setSourceLang(oldTarget);
    setTargetLang(oldSource);
    savePreferences({ sourceLang: oldTarget.code, targetLang: oldSource.code });

    if (result && result.primaryTranslation) {
      setInputText(result.primaryTranslation);
      handleTranslate(result.primaryTranslation, oldTarget.code, oldSource.code);
    }
  };

  const handleSelectLanguage = (lang: Language) => {
    if (langModalMode === 'source') {
      setSourceLang(lang);
      savePreferences({ sourceLang: lang.code, targetLang: targetLang.code });
      if (inputText.trim()) {
        handleTranslate(inputText, lang.code, targetLang.code);
      }
    } else {
      setTargetLang(lang);
      savePreferences({ sourceLang: sourceLang.code, targetLang: lang.code });
      if (inputText.trim()) {
        handleTranslate(inputText, sourceLang.code, lang.code);
      }
    }
  };

  const handleToggleSave = () => {
    if (!result) return;
    if (isWordSaved(result.word, result.targetLang)) {
      const id = `${result.word.toLowerCase()}_${result.targetLang}`;
      removeSavedWord(id);
    } else {
      saveWordToStorage(result);
    }
    setSavedWords(getSavedWords());
  };

  const handleRemoveWord = (id: string) => {
    removeSavedWord(id);
    setSavedWords(getSavedWords());
  };

  const handleToggleMastered = (id: string) => {
    toggleWordMastered(id);
    setSavedWords(getSavedWords());
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setInputText(item.word);
    setSourceLang(getLanguageByCode(item.sourceLang));
    setTargetLang(getLanguageByCode(item.targetLang));
    setActiveTab('dictionary');
    handleTranslate(item.word, item.sourceLang, item.targetLang);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleSearchWordFromSynonymOrCard = (newWord: string) => {
    setInputText(newWord);
    setActiveTab('dictionary');
    handleTranslate(newWord, sourceLang.code, targetLang.code);
  };

  return (
    <MobileFrame>
      {/* Top Header */}
      <Header
        savedCount={savedWords.length}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenCamera={() => setIsCameraModalOpen(true)}
        onOpenAndroidInfo={() => setIsAndroidModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Tab Content */}
      <main className="flex-1 p-3 pb-6 flex flex-col overflow-y-auto">
        {/* Android PWA Quick Banner */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-1 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-[11px]">صالح لهواتف أندرويد 100% (قابل للتثبيت PWA)</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAndroidModalOpen(true)}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
          >
            تثبيت التطبيق ➔
          </button>
        </div>
        {activeTab === 'dictionary' && (
          <div className="flex flex-col gap-2">
            {/* Language Selector Bar */}
            <LanguageSelectorBar
              sourceLang={sourceLang}
              targetLang={targetLang}
              onSelectSource={() => {
                setLangModalMode('source');
                setIsLangModalOpen(true);
              }}
              onSelectTarget={() => {
                setLangModalMode('target');
                setIsLangModalOpen(true);
              }}
              onSwapLanguages={handleSwapLanguages}
            />

            {/* Word Input */}
            <WordInputBox
              value={inputText}
              onChange={setInputText}
              onSubmit={(w) => handleTranslate(w)}
              isLoading={loading}
              sourceLangCode={sourceLang.speechCode || 'en-US'}
            />

            {/* Error banner if any */}
            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center my-1">
                {error}
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && !result && (
              <div className="w-full bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 animate-pulse my-2">
                <div className="h-4 bg-slate-700/60 rounded w-1/4 mb-3"></div>
                <div className="h-8 bg-slate-700/60 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-slate-700/60 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700/60 rounded w-2/3"></div>
              </div>
            )}

            {/* Dictionary Result Card */}
            {result && (
              <DictionaryCard
                result={result}
                isSaved={isWordSaved(result.word, result.targetLang)}
                onToggleSave={handleToggleSave}
                onSearchWord={handleSearchWordFromSynonymOrCard}
              />
            )}

            {/* Word of the day banner */}
            <WordOfTheDayCard
              onExploreWord={(w) => {
                setInputText(w);
                setSourceLang(getLanguageByCode('en'));
                setTargetLang(getLanguageByCode('ar'));
                handleTranslate(w, 'en', 'ar');
              }}
            />
          </div>
        )}

        {activeTab === 'multilingual' && (
          <MultiLangView
            initialWord={inputText || 'سلام'}
            onSelectWordForDeepAnalysis={(word, targetCode) => {
              setInputText(word);
              setTargetLang(getLanguageByCode(targetCode));
              setActiveTab('dictionary');
              handleTranslate(word, sourceLang.code, targetCode);
            }}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            savedWords={savedWords}
            onToggleMastered={handleToggleMastered}
            onRemoveWord={handleRemoveWord}
            onSelectWord={(w, target) => {
              setInputText(w);
              setTargetLang(getLanguageByCode(target));
              setActiveTab('dictionary');
              handleTranslate(w, sourceLang.code, target);
            }}
          />
        )}
      </main>

      {/* Language Picker Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        onSelect={handleSelectLanguage}
        currentSelectedCode={langModalMode === 'source' ? sourceLang.code : targetLang.code}
        allowAutoDetect={langModalMode === 'source'}
        title={langModalMode === 'source' ? 'اختر لغة الإدخال' : 'اختر لغة الترجمة'}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Saved Words Modal */}
      <SavedWordsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedWords={savedWords}
        onRemoveWord={handleRemoveWord}
        onToggleMastered={handleToggleMastered}
        onSelectWord={(w, target) => {
          setInputText(w);
          setTargetLang(getLanguageByCode(target));
          setActiveTab('dictionary');
          handleTranslate(w, sourceLang.code, target);
        }}
        onStartStudy={() => {
          setActiveTab('flashcards');
        }}
      />

      {/* Camera / Image OCR Modal */}
      <CameraOcrModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        targetLangCode={targetLang.code}
        onResultReceived={(ocrResult) => {
          setResult(ocrResult);
          setInputText(ocrResult.word);
          if (ocrResult.sourceLang) {
            setSourceLang(getLanguageByCode(ocrResult.sourceLang));
          }
          setActiveTab('dictionary');
          addHistoryItem({
            word: ocrResult.word,
            translation: ocrResult.primaryTranslation,
            sourceLang: ocrResult.sourceLang,
            targetLang: ocrResult.targetLang,
          });
          setHistory(getHistory());
        }}
      />

      {/* Android Compatibility & Install Modal */}
      <AndroidInstallModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => setDeferredPrompt(null)}
      />
    </MobileFrame>
  );
}
