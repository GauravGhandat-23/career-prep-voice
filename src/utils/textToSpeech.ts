
// Simple text-to-speech utility using the Web Speech API
export const speak = (text: string): void => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Ensure voices are loaded (important for Chrome)
    const loadVoices = () => {
      // Configure the voice 
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.includes('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      // Configure speech parameters
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }
};

export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

export const cancelSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
