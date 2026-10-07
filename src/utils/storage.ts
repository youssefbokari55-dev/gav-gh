import { HistoryItem, SavedWord, WordTranslationResult } from '../types/translator';

const STORAGE_SAVED_WORDS_KEY = 'polyglot_saved_words_v1';
const STORAGE_HISTORY_KEY = 'polyglot_history_v1';
const STORAGE_PREFS_KEY = 'polyglot_prefs_v1';

export function getSavedWords(): SavedWord[] {
  try {
    const data = localStorage.getItem(STORAGE_SAVED_WORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWordToStorage(result: WordTranslationResult): SavedWord {
  const words = getSavedWords();
  const id = `${result.word.toLowerCase()}_${result.targetLang}`;
  
  // Check if exists
  const existing = words.find((w) => w.id === id);
  if (existing) {
    return existing;
  }

  const newWord: SavedWord = {
    id,
    sourceWord: result.word,
    targetWord: result.primaryTranslation,
    sourceLang: result.sourceLang,
    targetLang: result.targetLang,
    phonetic: result.phonetic,
    partOfSpeech: result.partOfSpeech,
    exampleSentence: result.examples?.[0]?.sourceSentence,
    savedAt: Date.now(),
    mastered: false,
  };

  const updated = [newWord, ...words];
  localStorage.setItem(STORAGE_SAVED_WORDS_KEY, JSON.stringify(updated));
  return newWord;
}

export function removeSavedWord(id: string): void {
  const words = getSavedWords().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_SAVED_WORDS_KEY, JSON.stringify(words));
}

export function toggleWordMastered(id: string): void {
  const words = getSavedWords().map((w) =>
    w.id === id ? { ...w, mastered: !w.mastered } : w
  );
  localStorage.setItem(STORAGE_SAVED_WORDS_KEY, JSON.stringify(words));
}

export function isWordSaved(word: string, targetLang: string): boolean {
  const id = `${word.toLowerCase()}_${targetLang}`;
  return getSavedWords().some((w) => w.id === id);
}

export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
  try {
    const list = getHistory();
    // Avoid duplicate at the very top
    const filtered = list.filter(
      (h) => !(h.word.toLowerCase() === item.word.toLowerCase() && h.targetLang === item.targetLang)
    );
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...filtered].slice(0, 40); // keep last 40 searches
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_HISTORY_KEY);
}

export function getSavedPreferences(): { sourceLang: string; targetLang: string } {
  try {
    const data = localStorage.getItem(STORAGE_PREFS_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { sourceLang: 'en', targetLang: 'ar' };
}

export function savePreferences(prefs: { sourceLang: string; targetLang: string }): void {
  try {
    localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}
