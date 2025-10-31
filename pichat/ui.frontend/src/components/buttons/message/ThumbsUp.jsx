import { useState, useEffect } from 'preact/hooks';
import { MessageButton } from './MessageButton';
import { useChat } from '../../../providers/ChatProvider';

/**
 * ThumbsUp action button component
 * @param {Object} props
 * @param {Array} props.messages - Current messages array
 * @param {Object} props.currentMessage - The current message this action is for
 * @param {Function} [props.onClick] - Optional additional click handler
 * @param {string} [props.title="Good response"] - Tooltip text
 */
export function ThumbsUp({ messages, currentMessage, onClick, title = 'Good response' }) {
  const { toggleThumbsUp, getFeedbackType } = useChat();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (getFeedbackType && currentMessage) {
      const feedbackType = getFeedbackType(currentMessage.id);
      setIsActive(feedbackType === 'thumbs_up');
    }
  }, [getFeedbackType, currentMessage]);

  const handleClick = async () => {
    console.log('ThumbsUp clicked', { currentMessage });
    if (toggleThumbsUp && currentMessage) {
      const result = await toggleThumbsUp(currentMessage.id, currentMessage.content);
      console.log('Toggle result:', result);
      setIsActive(result.type === 'thumbs_up');

      // Call additional onClick if provided
      if (onClick) {
        onClick(result);
      }
    } else {
      console.warn('Missing requirements for toggle:', {
        hasToggleMethod: !!toggleThumbsUp,
        hasCurrentMessage: !!currentMessage,
        currentMessageId: currentMessage?.id,
      });
    }
  };

  return <MessageButton iconClass="pichat-icon-thumbs-up" onClick={handleClick} title={title} isActive={isActive} />;
}
