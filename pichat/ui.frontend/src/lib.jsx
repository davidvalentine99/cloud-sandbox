import { render } from 'preact';
import { ChatApp } from './components/ChatApp';
import './styles/theme.css';

/**
 * Initialize the chat application on a page
 * @param {Object} options - Configuration options
 * @param {string} [options.targetElement] - CSS selector or element to render into (default: 'body')
 * @param {string} [options.configEndpoint] - URL to fetch config from
 * @param {string} [options.endpoint] - Chat API endpoint
 * @param {Object} [options.initialContext] - Initial app context (user, page info, etc.)
 * @param {Object} [options.config] - Static config object (overrides configEndpoint)
 * @param {Function} [options.Footer] - Custom footer component
 * @param {Function} [options.Header] - Custom header component
 * @param {Function} [options.MessageList] - Custom message list component
 * @param {Function} [options.Input] - Custom input component
 * @param {Function|Array} [options.messageButtons] - Custom message buttons
 * @param {Function} [options.onSendMessage] - Custom message send handler
 * @param {Function} [options.onThumbUp] - Custom thumb up handler
 * @param {Function} [options.onThumbDown] - Custom thumb down handler
 * @param {boolean} [options.allowExternalUpdates] - Allow external context updates
 * @returns {Object} API object with methods to control the chat
 */
export function initChat(options = {}) {
  const {
    targetElement = 'body',
    configEndpoint,
    endpoint,
    initialContext = {},
    config = {},
    Footer,
    Header,
    MessageList,
    Input,
    messageButtons,
    onSendMessage,
    onThumbUp,
    onThumbDown,
    allowExternalUpdates = true,
    ...otherProps
  } = options;

  // Find the target element
  const targetEl = typeof targetElement === 'string' ? document.querySelector(targetElement) : targetElement;

  if (!targetEl) {
    console.error(`Target element "${targetElement}" not found`);
    return null;
  }

  // Create a container div for the chat app (don't replace body content)
  const container = document.createElement('div');
  container.id = 'chat-app-container';
  targetEl.appendChild(container);

  // Render the ChatApp into the container
  const appElement = render(
    <ChatApp
      configEndpoint={configEndpoint}
      endpoint={endpoint}
      initialContext={initialContext}
      Footer={Footer}
      Header={Header}
      MessageList={MessageList}
      Input={Input}
      messageButtons={messageButtons}
      onSendMessage={onSendMessage}
      onThumbUp={onThumbUp}
      onThumbDown={onThumbDown}
      allowExternalUpdates={allowExternalUpdates}
      {...config}
      {...otherProps}
    />,
    container
  );

  // Return API for controlling the chat
  return {
    /**
     * Destroy the chat instance
     */
    destroy() {
      render(null, container);
      container.remove();
    },

    /**
     * Get the app context API (for updating context)
     */
    getContext() {
      return window.chatAppContext;
    },

    /**
     * Update app context
     * @param {Object} updates - Context updates
     */
    updateContext(updates) {
      if (window.chatAppContext) {
        window.chatAppContext.update(updates);
      }
    },

    /**
     * Set a specific context value
     * @param {string} key - Context key
     * @param {*} value - Context value
     */
    setContext(key, value) {
      if (window.chatAppContext) {
        window.chatAppContext.set(key, value);
      }
    },
  };
}

// Export components for advanced usage
export { ChatApp } from './components/ChatApp';
export { ChatProvider, useChat } from './providers/ChatProvider';
export { AppContextProvider, useAppContext } from './providers/AppContextProvider';

// Auto-initialize if window.ChatAppConfig exists
if (typeof window !== 'undefined' && window.ChatAppConfig) {
  window.addEventListener('DOMContentLoaded', () => {
    window.chatApp = initChat(window.ChatAppConfig);
  });
}
