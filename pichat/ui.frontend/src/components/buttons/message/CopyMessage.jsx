import { MessageButton } from './MessageButton';
import { useChat } from '../../../providers/ChatProvider';

/**
 * CopyMessage action button component
 * @param {Object} props
 * @param {Array} props.messages - Current messages array
 * @param {Object} props.currentMessage - The current message this action is for
 * @param {Function} [props.onClick] - Optional additional click handler
 * @param {string} [props.title="Copy message"] - Tooltip for copy button
 * @param {string} [props.tooltipText="Copied!"] - Tooltip when copied
 * @param {number} [props.tooltipDuration=2000] - Duration to show tooltip in milliseconds (0 or negative to disable)
 */
export function CopyMessage({
  messages,
  currentMessage,
  onClick,
  title = 'Copy message',
  tooltipText = 'Copied!',
  tooltipDuration = 2000,
}) {
  const { copyMessage } = useChat();

  const handleCopy = async () => {
    // Call provider method to copy message
    if (copyMessage && currentMessage) {
      const success = await copyMessage(currentMessage.content);

      // Call additional onClick if provided
      if (onClick) {
        onClick(currentMessage.content, success);
      }
    }
  };

  return (
    <MessageButton
      iconClass="pichat-icon-copy"
      endIconClass="pichat-icon-check"
      onClick={handleCopy}
      title={title}
      tooltipText={tooltipText}
      tooltipDuration={tooltipDuration}
    />
  );
}
