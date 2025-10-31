import { useState, useEffect } from 'preact/hooks';
import { MessageButton } from './MessageButton';
import { useChat } from '../../../providers/ChatProvider';

/**
 * ThumbsDown action button component
 * @param {Object} props
 * @param {Array} props.messages - Current messages array
 * @param {Object} props.currentMessage - The current message this action is for
 * @param {Function} [props.onClick] - Optional additional click handler
 * @param {string} [props.title="Bad response"] - Tooltip text
 */
export function ThumbsDown({ messages, currentMessage, onClick, title = 'Bad response' }) {
  const { toggleThumbsDown, getFeedbackType } = useChat();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (getFeedbackType && currentMessage) {
      const feedbackType = getFeedbackType(currentMessage.id);
      setIsActive(feedbackType === 'thumbs_down');
    }
  }, [getFeedbackType, currentMessage]);

  const handleClick = async () => {
    console.log('ThumbsDown clicked', { currentMessage });
    if (toggleThumbsDown && currentMessage) {
      const result = await toggleThumbsDown(currentMessage.id, currentMessage.content);
      console.log('Toggle result:', result);
      setIsActive(result.type === 'thumbs_down');

      // Call additional onClick if provided
      if (onClick) {
        onClick(result);
      }
    } else {
      console.warn('Missing requirements for toggle:', {
        hasToggleMethod: !!toggleThumbsDown,
        hasCurrentMessage: !!currentMessage,
        currentMessageId: currentMessage?.id,
      });
    }
  };

  return <MessageButton iconClass="pichat-icon-thumbs-down" onClick={handleClick} title={title} isActive={isActive} />;
}
