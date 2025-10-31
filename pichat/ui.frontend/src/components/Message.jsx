import { cloneElement } from 'preact';
import { formatMarkdown } from '../utils/formatMarkdown';
import { MessageFooter } from './MessageFooter';
import { References } from './References';

/**
 * Message component for displaying chat messages
 * @param {Object} props
 * @param {string} [props.id] - Message ID for tracking
 * @param {string} props.sender - Message sender type ('user' or 'ai')
 * @param {string} props.name - Display name of the sender
 * @param {string} [props.avatar] - Avatar text/initials for user messages
 * @param {string} props.content - Message content (supports markdown)
 * @param {Array} [props.links] - Array of link objects with url, text, and optional note
 * @param {boolean} [props.isStreaming] - Whether the message is currently being streamed
 * @param {string} [props.status] - Current status text (e.g., "Searching documents...")
 * @param {Array} [props.buttons] - Array of button components to display
 * @param {Array} props.messages - All messages in the conversation
 */
export function Message({ id, sender, name, avatar, content, links, isStreaming, status, buttons, messages }) {
  const isUser = sender === 'user';
  const currentMessage = {
    id,
    sender,
    name,
    avatar,
    content,
    links,
    isStreaming,
  };

  return (
    <div class={`pichat-message ${isUser ? 'pichat-message-user' : 'pichat-message-ai'}`}>
      <div class="pichat-message-header">
        {isUser ? (
          <div class="pichat-avatar pichat-avatar-user">{avatar}</div>
        ) : (
          <div class="pichat-avatar pichat-avatar-ai pichat-icon-assistant"></div>
        )}
        <div class="pichat-message-sender-wrapper">
          <span class="pichat-message-sender">{name}</span>
          {!isUser && status && (
            <div class="pichat-message-status">
              {status}<span class="pichat-status-dots"></span>
            </div>
          )}
        </div>
      </div>

      <div class="pichat-message-content">
        <div class="pichat-message-text" dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
        {isStreaming && <span class="pichat-streaming-cursor">▊</span>}

        <References links={links} />
      </div>

      {!isUser && buttons && buttons.length > 0 && (
        <MessageFooter>
          {buttons.map((button) =>
            cloneElement(button, {
              messages: messages,
              currentMessage: currentMessage,
              ...button.props,
            })
          )}
        </MessageFooter>
      )}
    </div>
  );
}
