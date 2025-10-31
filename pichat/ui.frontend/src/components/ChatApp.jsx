import { useRef, useEffect, useState } from 'preact/hooks';
import { Popup } from './Popup';
import { PopupButton } from './PopupButton';
import { ChatProvider } from '../providers/ChatProvider';
import { AppContextProvider } from '../providers/AppContextProvider';
import { useConfig } from '../hooks/useConfig';

/**
 * Generic ChatApp component
 * @param {Object} props
 * @param {string} [props.configEndpoint] - URL to fetch chat configuration from (e.g., '/api/config')
 * @param {string} [props.endpoint] - API endpoint URL for chat messages
 * @param {Component} [props.Header] - Custom header component
 * @param {Component} [props.MessageList] - Custom message list component
 * @param {Component} [props.Input] - Custom input component
 * @param {Component} [props.Footer] - Custom footer component
 * @param {Array} [props.messageButtons] - Custom message buttons
 * @param {boolean} [props.autoScroll=true] - Enable auto-scroll
 * @param {string} [props.title] - Chat title (fallback if not in AJAX config)
 * @param {boolean} [props.showThemeToggle] - Show theme toggle (fallback if not in AJAX config)
 * @param {Object} [props.initialMessage] - Initial message (fallback if not in AJAX config)
 * @param {boolean} [props.streamInitialMessage] - Whether to stream initial message on new chat (fallback if not in AJAX config)
 * @param {Function} [props.onSendMessage] - Custom message handler
 * @param {Function} [props.onThumbUp] - Callback when thumb up is clicked
 * @param {Function} [props.onThumbDown] - Callback when thumb down is clicked
 * @param {boolean} [props.showCopyButton] - Show copy button (fallback if not in AJAX config)
 * @param {boolean} [props.showFeedbackButtons] - Show feedback buttons (fallback if not in AJAX config)
 * @param {string} [props.placeholder] - Input placeholder text (fallback if not in AJAX config)
 * @param {boolean} [props.popupHiddenOnLoad] - Whether popup is hidden on load (fallback if not in AJAX config)
 * @param {Object} [props.initialContext] - Initial app context (e.g., user, page)
 * @param {boolean|Array<string>} [props.allowExternalUpdates=true] - Allow external updates; array to allowlist keys
 */
export function ChatApp({
  // Config
  configEndpoint,

  // Chat provider props
  endpoint,
  initialMessage: initialMessageProp,
  streamInitialMessage: streamInitialMessageProp,
  onSendMessage,
  onThumbUp,
  onThumbDown,

  // App context
  initialContext,
  allowExternalUpdates = true,

  // UI component overrides (JSX - not from config)
  Header,
  MessageList,
  Input,
  Footer,

  // UI configuration props (can be overridden or come from config)
  messageButtons,
  autoScroll = true,
  title: titleProp,
  showThemeToggle: showThemeToggleProp,
  showCopyButton: showCopyButtonProp,
  showFeedbackButtons: showFeedbackButtonsProp,
  placeholder: placeholderProp,
  popupHiddenOnLoad: popupHiddenOnLoadProp,

  // Additional popup props
  ...popupProps
}) {
  // Fetch config from endpoint if provided
  const { config: fetchedConfig, loading: configLoading } = useConfig(configEndpoint, {});

  // AJAX config wins over props, props win over defaults
  const title = fetchedConfig.title ?? titleProp ?? 'Chat with Assistant';
  const showThemeToggle = fetchedConfig.showThemeToggle ?? showThemeToggleProp ?? true;
  const showCopyButton = fetchedConfig.showCopyButton ?? showCopyButtonProp ?? true;
  const showFeedbackButtons = fetchedConfig.showFeedbackButtons ?? showFeedbackButtonsProp ?? true;
  const placeholder = fetchedConfig.placeholder ?? placeholderProp ?? 'Type a message';
  const popupHiddenOnLoad = fetchedConfig.popupHiddenOnLoad ?? popupHiddenOnLoadProp ?? true;
  const streamInitialMessage = fetchedConfig.streamInitialMessage ?? streamInitialMessageProp ?? true;
  const initialMessage = fetchedConfig.initialMessage ?? initialMessageProp;

  const [popupHidden, setPopupHidden] = useState(popupHiddenOnLoad);

  // Group props for clarity
  const chatProviderProps = {
    endpoint,
    initialMessage,
    streamInitialMessage,
    onSendMessage,
    onThumbUp,
    onThumbDown,
  };

  const uiProps = {
    Header,
    MessageList,
    Input,
    Footer,
    messageButtons,
    autoScroll,
    title,
    showThemeToggle,
    showCopyButton,
    showFeedbackButtons,
    placeholder,
    popupHidden,
    setPopupHidden,
    ...popupProps,
  };

  const popupButtonProps = {
    title: 'Chat with Assistant',
    icon: 'pichat-icon-assistant',
    popupHidden,
    setPopupHidden,
  };

  return (
    <AppContextProvider initialContext={initialContext} allowExternalUpdates={allowExternalUpdates}>
      <ChatProvider {...chatProviderProps}>
        <Popup {...uiProps} />
        <PopupButton {...popupButtonProps} />
      </ChatProvider>
    </AppContextProvider>
  );
}
