import '../styles/voice-mode.css';

/**
 * Voice Mode Toggle Button
 * Button to enable/disable voice mode
 * Styled to match the send button
 * @param {Object} props
 * @param {Function} props.onClick - Callback when button is clicked
 * @param {string} props.label - Button label for accessibility
 */
export function VoiceModeButton({ onClick, label = 'Use voice mode' }) {
  return (
    <button
      class="pichat-send-button pichat-action-icon pichat-icon-microphone"
      onClick={onClick}
      aria-label={label}
      title={label}
    ></button>
  );
}
