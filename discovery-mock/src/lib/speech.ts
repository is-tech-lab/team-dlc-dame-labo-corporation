type SpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
};

let voicesReady = false;

const ensureVoicesLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (voicesReady || window.speechSynthesis.getVoices().length > 0) {
      voicesReady = true;
      resolve();
      return;
    }
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handler = () => {
      voicesReady = true;
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      if (timer !== null) clearTimeout(timer);
      resolve();
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    timer = setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve();
    }, 1000);
  });
};

export const speak = async (text: string, options: SpeakOptions = {}): Promise<void> => {
  if (!('speechSynthesis' in window)) {
    console.warn('[mock] Web Speech API は使えない。テキストを表示のみ:', text);
    return;
  }

  await ensureVoicesLoaded();

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? 'ja-JP';
  utterance.rate = options.rate ?? 0.95;
  utterance.pitch = options.pitch ?? 0.85;
  utterance.volume = options.volume ?? 1.0;

  const voices = window.speechSynthesis.getVoices();
  const ja = voices.find((v) => v.lang.startsWith('ja'));
  if (ja) utterance.voice = ja;

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
