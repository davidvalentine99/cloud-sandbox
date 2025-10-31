import { lazy, Suspense, forwardRef } from 'preact/compat';
import { Input } from './Input';
import { useChat } from '../providers/ChatProvider';
import { useScreen } from '../hooks/useScreen';

// Conditionally load voice components only when feature is enabled
const voiceEnabled = import.meta.env.VITE_ENABLE_VOICE_MODE === 'true';

const VoiceModeButton = voiceEnabled
  ? lazy(() => import('../features/voice').then((m) => ({ default: m.VoiceModeButton })))
  : null;

/**
 * Voice-enabled Input Wrapper
 * Conditionally shows voice mode button based on feature flag
 * Uses the screen system to open voice mode
 */
export const VoiceEnabledInput = forwardRef((props, ref) => {
  const { handleSendMessage } = useChat();
  const { openScreen } = useScreen();

  const handleVoiceMessage = (text) => {
    if (text && handleSendMessage) {
      handleSendMessage(text);
    }
  };

  const handleVoiceButtonClick = () => {
    openScreen('voice-mode', {
      onSendMessage: handleVoiceMessage,
    });
  };

  // If voice mode is disabled, just return the regular Input
  if (!voiceEnabled) {
    return <Input {...props} ref={ref} />;
  }

  return (
    <Input
      {...props}
      ref={ref}
      additionalButtons={
        VoiceModeButton && (
          <Suspense fallback={null}>
            <VoiceModeButton onClick={handleVoiceButtonClick} />
          </Suspense>
        )
      }
    />
  );
});
