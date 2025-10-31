/**
 * Voice Feature Module Entry Point
 * Exports voice components and hooks with tree-shaking support
 * This module is only included in the bundle when VITE_ENABLE_VOICE_MODE is true
 */

// Re-export components
export { VoiceMode } from './components/VoiceMode';
export { VoiceModeScreen } from './components/VoiceModeScreen';
export { VoiceModeButton } from './components/VoiceModeButton';

// Re-export hooks
export { useVoiceRecording } from './hooks/useVoiceRecording';
export { useAudioPlayback } from './hooks/useAudioPlayback';

// Re-export services
export { transcribeAudio, synthesizeSpeech, createVoiceStream } from './services/voiceApi';
