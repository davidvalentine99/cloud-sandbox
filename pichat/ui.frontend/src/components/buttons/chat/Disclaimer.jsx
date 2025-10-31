import { ChatButton } from './ChatButton';

/**
 * Disclaimer button component
 * @param {Object} props
 * @param {Function} [props.onClick] - Custom click handler (overrides default behavior)
 * @param {string} [props.title="AI Disclaimer"] - Tooltip text
 * @param {string} [props.label="AI can make mistakes"] - Button label
 * @param {string} [props.iconClass="pichat-icon-info"] - Icon class
 * @param {string} [props.disclaimerText] - Custom disclaimer text to show on click (only used if onClick not provided)
 */
export function Disclaimer({
  onClick,
  title = 'AI Disclaimer',
  label = 'AI can make mistakes',
  iconClass = 'pichat-icon-info',
  disclaimerText = 'This AI assistant can make mistakes. Please verify important information and use your own judgment when making decisions.',
}) {
  const handleClick = () => {
    // If onClick is provided, use it instead of default behavior
    if (onClick) {
      onClick();
    } else {
      // Otherwise show default disclaimer alert (in production, this would be a modal)
      alert(disclaimerText);
    }
  };

  return (
    <ChatButton iconClass={iconClass} onClick={handleClick} title={title} label={label} className="pichat-disclaimer" />
  );
}
