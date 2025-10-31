import { useState, useRef, useCallback, useEffect } from 'preact/hooks';

// Voice reset phrases that trigger transcript reset
const VOICE_RESET_PHRASES = ['start over', 'restart', 'begin again'];

/**
 * Hook for voice recording using Web Speech API
 * Provides real-time speech recognition with transcript updates
 * @returns {Object} Recording state and controls
 */
export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const audioStreamRef = useRef(null);

  /**
   * Initialize Speech Recognition API
   */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        console.log('[VoiceRecording] Final transcript:', finalTranscript);
        // Check for voice reset phrases
        finalTranscript = handleVoiceReset(finalTranscript);
        setTranscript((prev) => (prev + ' ' + finalTranscript).trim());
      }
      if (interim) {
        console.log('[VoiceRecording] Interim transcript:', interim);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  /**
   * Handle voice reset phrases
   * If a reset phrase is detected, return text after the phrase
   */
  const handleVoiceReset = (text) => {
    const regex = new RegExp(`(${VOICE_RESET_PHRASES.join('|')})`, 'i');
    const matches = text.match(regex);

    if (matches) {
      const lastMatchIndex = text.toLowerCase().lastIndexOf(matches[0]);
      if (lastMatchIndex !== -1) {
        // Reset previous transcript and return text after reset phrase
        setTranscript('');
        return text.substring(lastMatchIndex + matches[0].length).trim();
      }
    }
    return text;
  };

  /**
   * Start recording audio and speech recognition
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      setInterimTranscript('');

      // Get microphone access for audio visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      }
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Microphone access denied');
      throw err;
    }
  }, []);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      setIsRecording(false);
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
  }, [isRecording]);

  /**
   * Cancel recording without saving transcript
   */
  const cancelRecording = useCallback(() => {
    stopRecording();
    setTranscript('');
    setInterimTranscript('');
  }, [stopRecording]);

  /**
   * Clear transcript
   */
  const clearAudio = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  /**
   * Get audio stream for visualization
   */
  const getAudioStream = () => audioStreamRef.current;

  // For compatibility with existing code, create an audioBlob
  // when transcript is available (mock blob with transcript as text)
  const audioBlob = transcript ? new Blob([transcript], { type: 'text/plain' }) : null;

  return {
    isRecording,
    audioBlob, // For compatibility
    transcript, // The actual transcribed text
    interimTranscript, // Real-time interim results
    error,
    audioStream: audioStreamRef.current,
    startRecording,
    stopRecording,
    cancelRecording,
    clearAudio,
    getAudioStream,
  };
}
