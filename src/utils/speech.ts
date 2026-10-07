// Client-side Web Speech API + Server-side Gemini TTS fallback

export async function playSpeech(text: string, langCode: string = 'en'): Promise<void> {
  if (!text || !text.trim()) return;

  // 1. Try Web Speech API first for zero-latency playback
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = 0.95; // Slightly slower for clear dictionary pronunciation
      utterance.pitch = 1.0;

      // Map language code to BCP 47 language tag
      const langMap: Record<string, string> = {
        ar: 'ar-SA',
        en: 'en-US',
        fr: 'fr-FR',
        es: 'es-ES',
        de: 'de-DE',
        tr: 'tr-TR',
        it: 'it-IT',
        ru: 'ru-RU',
        ja: 'ja-JP',
        ko: 'ko-KR',
        zh: 'zh-CN',
        pt: 'pt-BR',
        hi: 'hi-IN',
        ur: 'ur-PK',
        fa: 'fa-IR',
        id: 'id-ID',
        nl: 'nl-NL',
        sv: 'sv-SE',
        pl: 'pl-PL',
        el: 'el-GR',
        he: 'he-IL',
        vi: 'vi-VN',
        th: 'th-TH',
      };

      utterance.lang = langMap[langCode] || langCode;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find matching voice
        const matchingVoice = voices.find((v) =>
          v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase())
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      let spoken = false;
      return new Promise<void>((resolve) => {
        utterance.onend = () => {
          spoken = true;
          resolve();
        };
        utterance.onerror = () => {
          // If browser speech synthesis failed, fallback to Gemini TTS
          if (!spoken) {
            fallbackServerTTS(text, langCode).then(resolve).catch(() => resolve());
          }
        };

        window.speechSynthesis.speak(utterance);

        // Safety timeout in case browser speech gets stuck (known Chrome issue)
        setTimeout(() => {
          if (!spoken) {
            resolve();
          }
        }, 3500);
      });
    } catch {
      // Fall through to server-side TTS
    }
  }

  // Fallback to server-side Gemini TTS
  await fallbackServerTTS(text, langCode);
}

async function fallbackServerTTS(text: string, _langCode: string): Promise<void> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return;

    const data = await res.json();
    if (data.audioBase64) {
      const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      await audio.play();
    }
  } catch (err) {
    console.warn('Fallback TTS failed:', err);
  }
}

// Voice input using Speech Recognition
export interface SpeechRecognitionResultListener {
  onResult: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function startSpeechRecognition(
  langCode: string,
  listeners: SpeechRecognitionResultListener
): { stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    listeners.onError('ميزة التعرف الصوتي غير مدعومة في هذا المتصفح');
    return null;
  }

  try {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    const langMap: Record<string, string> = {
      ar: 'ar-SA',
      en: 'en-US',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
      tr: 'tr-TR',
      it: 'it-IT',
      ru: 'ru-RU',
      ja: 'ja-JP',
      ko: 'ko-KR',
      zh: 'zh-CN',
      pt: 'pt-BR',
      hi: 'hi-IN',
      ur: 'ur-PK',
      fa: 'fa-IR',
    };

    recognition.lang = langMap[langCode] || langCode || 'ar-SA';

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        listeners.onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      listeners.onError(event.error || 'حدث خطأ أثناء الاستماع');
    };

    recognition.onend = () => {
      listeners.onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {}
      },
    };
  } catch (e: any) {
    listeners.onError(e?.message || 'تعذر بدء التعرف على الصوت');
    return null;
  }
}
