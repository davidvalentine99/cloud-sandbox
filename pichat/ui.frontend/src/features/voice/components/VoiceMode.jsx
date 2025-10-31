import { useState, useEffect } from 'preact/hooks';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { transcribeAudio, synthesizeSpeech } from '../services/voiceApi';
import '../styles/voice-mode.css';

/**
 * Voice Mode Component
 * Full-screen voice interface for voice conversations
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether voice mode is open
 * @param {Function} props.onClose - Callback to close voice mode
 * @param {Function} props.onSendMessage - Callback to send transcribed message
 * @param {string} props.latestAiMessage - Latest AI message to speak
 */
export function VoiceMode({ isOpen, onClose, onSendMessage, latestAiMessage }) {
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [transcription, setTranscription] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');

  const { isRecording, audioBlob, startRecording, stopRecording, clearAudio } = useVoiceRecording();
  const { isPlaying, play } = useAudioPlayback();

  // Handle recording start/stop
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      setTranscription('');
      setInterimTranscription('Listening...');
      setStatus('listening');
      try {
        await startRecording();
      } catch (error) {
        console.error('Failed to start recording:', error);
        setInterimTranscription('Microphone access denied');
        setStatus('idle');
      }
    }
  };

  // Process audio when recording stops
  useEffect(() => {
    if (!isRecording && audioBlob && status === 'listening') {
      processAudio();
    }
  }, [isRecording, audioBlob]);

  // Process recorded audio
  const processAudio = async () => {
    if (!audioBlob) return;

    setStatus('processing');
    setInterimTranscription('Processing...');

    try {
      // Transcribe audio
      const result = await transcribeAudio(audioBlob);
      setTranscription(result.text);
      setInterimTranscription('');

      // Send transcribed message to chat
      if (result.text && onSendMessage) {
        onSendMessage(result.text);
      }

      clearAudio();
      setStatus('idle');
    } catch (error) {
      console.error('Failed to process audio:', error);
      setInterimTranscription('Failed to process audio');
      setStatus('idle');
    }
  };

  // Play AI response when it arrives
  useEffect(() => {
    if (latestAiMessage && isOpen && status !== 'speaking') {
      playAiResponse(latestAiMessage);
    }
  }, [latestAiMessage]);

  // Synthesize and play AI response
  const playAiResponse = async (text) => {
    if (!text) return;

    setStatus('speaking');

    try {
      const audioBlob = await synthesizeSpeech(text);
      play(audioBlob);
    } catch (error) {
      console.error('Failed to synthesize speech:', error);
      setStatus('idle');
    }
  };

  // Update status when playback ends
  useEffect(() => {
    if (!isPlaying && status === 'speaking') {
      setStatus('idle');
    }
  }, [isPlaying, status]);

  // Get orb class based on status
  const getOrbClass = () => {
    if (status === 'listening') return 'pichat-voice-orb listening';
    if (status === 'speaking') return 'pichat-voice-orb speaking';
    return 'pichat-voice-orb';
  };

  // Get status text
  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'speaking':
        return 'Speaking...';
      default:
        return 'Tap to speak';
    }
  };

  if (!isOpen) return null;

  return (
    <div class="pichat-voice-overlay">
      <button class="pichat-voice-close" onClick={onClose} aria-label="Close voice mode">
        ✕
      </button>

      <div class="pichat-voice-container">
        {/* Voice Orb Visualization */}
        <div class={getOrbClass()}></div>

        {/* Transcription Display */}
        <div class="pichat-voice-transcription">
          {transcription && <p class="pichat-voice-transcription-text">{transcription}</p>}
          {interimTranscription && (
            <p class="pichat-voice-transcription-text pichat-voice-transcription-interim">
              {interimTranscription}
            </p>
          )}
        </div>

        {/* Voice Controls */}
        <div class="pichat-voice-controls">
          <button
            class={`pichat-voice-button pichat-voice-button-primary ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            disabled={status === 'processing' || status === 'speaking'}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? '⏸' : '🎤'}
          </button>
        </div>

        {/* Status Text */}
        <p class="pichat-voice-status">{getStatusText()}</p>
      </div>
    </div>
  );
}
