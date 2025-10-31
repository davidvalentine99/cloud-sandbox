import { ChatButton } from './ChatButton';
import { useChat } from '../../../providers/ChatProvider';

/**
 * NewChat button component
 * @param {Object} props
 * @param {Function} [props.onClick] - Custom click handler (overrides default behavior)
 * @param {string} [props.title="Start a new conversation"] - Tooltip text
 * @param {string} [props.label="Start new chat"] - Button label
 * @param {string} [props.iconClass="pichat-icon-plus"] - Icon class
 */
export function NewChat({
  onClick,
  title = 'Start a new conversation',
  label = 'Start new chat',
  iconClass = 'pichat-icon-plus',
}) {
  const { startNewChat } = useChat();

  const handleClick = () => {
    // If onClick is provided, use it instead of default behavior
    if (onClick) {
      onClick();
    } else {
      // Otherwise use the default hook method to start new chat
      startNewChat();
    }
  };

  return (
    <ChatButton iconClass={iconClass} onClick={handleClick} title={title} label={label} className="pichat-new-chat" />
  );
}
