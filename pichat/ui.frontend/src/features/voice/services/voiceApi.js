/**
 * Voice API service for transcription and text-to-speech
 * Communicates with mock server (later can be swapped for OpenAI/Azure)
 */

const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL || '/pichat';

/**
 * Transcribe audio blob to text
 * @param {Blob} audioBlob - Audio recording blob
 * @param {string} language - Language code (default: 'en-US')
 * @returns {Promise<{text: string, confidence: number}>}
 */
export async function transcribeAudio(audioBlob, language = 'en-US') {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  formData.append('language', language);

  try {
    const response = await fetch(`${ENDPOINT_URL}/api/voice/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || '',
      confidence: data.confidence || 1.0,
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

/**
 * Synthesize text to speech using browser's Web Speech API
 * Falls back to server API if browser TTS is not available
 * @param {string} text - Text to convert to speech
 * @param {string} voice - Voice ID (default: 'alloy')
 * @returns {Promise<Blob>} Audio blob (null for browser TTS)
 */
export async function synthesizeSpeech(text, voice = 'alloy') {
  // Check if browser supports speech synthesis
  if ('speechSynthesis' in window) {
    return new Promise((resolve, reject) => {
      console.log('[Browser TTS] Using Web Speech Synthesis API');

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings
      utterance.rate = 1.0; // Speed (0.1 to 10)
      utterance.pitch = 1.0; // Pitch (0 to 2)
      utterance.volume = 1.0; // Volume (0 to 1)

      // Function to set voice when available
      const setVoice = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Prefer English voices
          const englishVoice = voices.find((v) => v.lang.startsWith('en-'));
          if (englishVoice) {
            utterance.voice = englishVoice;
            console.log('[Browser TTS] Using voice:', englishVoice.name);
          } else if (voices[0]) {
            // Use first available voice if no English voice found
            utterance.voice = voices[0];
            console.log('[Browser TTS] Using default voice:', voices[0].name);
          }
        }
      };

      // Set voice immediately if available, or wait for voices to load
      setVoice();

      // On some browsers, voices load asynchronously
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
      }

      // Handle events
      utterance.onend = () => {
        console.log('[Browser TTS] Speech completed');
        // Return null since browser TTS doesn't produce a blob
        // The audio is played directly by the browser
        resolve(null);
      };

      utterance.onerror = (error) => {
        console.error('[Browser TTS] Speech error:', error);
        reject(error);
      };

      // Cancel any ongoing speech and speak
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    });
  }

  // Fallback to server API if browser TTS not available
  console.log('[Server TTS] Browser TTS not available, using server API');
  try {
    const response = await fetch(`${ENDPOINT_URL}/api/voice/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
        model: 'tts-1',
      }),
    });

    if (!response.ok) {
      throw new Error(`Speech synthesis failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('Speech synthesis error:', error);
    throw error;
  }
}

/**
 * Stop any ongoing speech synthesis
 * Useful for interrupting AI speech when user starts talking
 */
export function stopSpeechSynthesis() {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    console.log('[Browser TTS] Stopping speech synthesis');
    window.speechSynthesis.cancel();
  }
}

/**
 * Stream voice conversation (bidirectional)
 * Future implementation for real-time voice chat
 * @param {Function} onMessage - Callback for received messages
 * @returns {Object} WebSocket connection controls
 */
export function createVoiceStream(onMessage) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const ws = new WebSocket(`${protocol}//${host}/api/voice/stream`);

  ws.onopen = () => {
    console.log('Voice stream connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse voice stream message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('Voice stream error:', error);
  };

  ws.onclose = () => {
    console.log('Voice stream closed');
  };

  return {
    send: (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    },
    close: () => {
      ws.close();
    },
  };
}
