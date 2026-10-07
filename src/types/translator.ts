export interface Language {
  code: string;
  name: string; // Arabic name
  englishName: string;
  nativeName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
  speechCode: string;
  popular?: boolean;
}

export interface WordTranslationResult {
  word: string;
  sourceLang: string;
  targetLang: string;
  detectedSourceLang?: string;
  primaryTranslation: string;
  phonetic: string;
  partOfSpeech: string;
  definitions: string[];
  alternativeTranslations: Array<{
    translation: string;
    meaning: string;
    partOfSpeech?: string;
  }>;
  examples: Array<{
    sourceSentence: string;
    targetSentence: string;
  }>;
  synonyms: string[];
  antonyms: string[];
  grammarNotes?: string;
  culturalContext?: string;
  timestamp: number;
}

export interface MultiLangResult {
  langCode: string;
  langName: string;
  flag: string;
  translation: string;
  phonetic?: string;
  partOfSpeech?: string;
}

export interface SavedWord {
  id: string;
  sourceWord: string;
  targetWord: string;
  sourceLang: string;
  targetLang: string;
  phonetic: string;
  partOfSpeech: string;
  exampleSentence?: string;
  savedAt: number;
  mastered: boolean;
}

export interface HistoryItem {
  id: string;
  word: string;
  translation: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export interface WordOfTheDay {
  word: string;
  sourceLang: string;
  translation: string;
  targetLang: string;
  phonetic: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  funFact: string;
}
