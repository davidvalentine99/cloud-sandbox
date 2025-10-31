import { Component, render } from 'preact';
import { useRef, useEffect, useState } from 'preact/hooks';
import { Popup } from '../Popup';
import { PopupButton } from '../PopupButton';
import { ChatProvider } from '../../providers/ChatProvider';
import { AppContextProvider } from '../../providers/AppContextProvider';
import { useConfig } from '../../hooks/useConfig';
import '../../styles/theme.css';

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
 * @param {Object} [props.webComponentProps] - Web component props
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

  // Web component props
  webComponentProps,

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
  const [theme, setTheme] = useState(null);
  const [themesLoaded, setThemesLoaded] = useState(false);

  const loadThemes = async () => {
    try {
      const testPathParam = new URLSearchParams(window.location.search).get('testChatbotPath');
      const response = await fetch(`/bin/pichat/config?path=${testPathParam || window.location.pathname}`);
      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        if (data.success) {
          setTheme(data.theme);
        } else {
          console.warn('Failed to load configuration');
        }
      } else {
        console.warn('Failed to load configuration');
      }
    } catch (error) {
      console.warn('Error loading configuration:', error);
    } finally {
      console.log('Themes loaded');
      setThemesLoaded(true);
    }
  };

  useEffect(() => {
    console.log('Loading themes', theme);
    loadThemes();
  }, []);

  // Group props for clarity
  const chatProviderProps = {
    endpoint,
    initialMessage,
    streamInitialMessage,
    onSendMessage,
    onThumbUp,
    onThumbDown,
    theme,
    webComponentProps,
  };

  const uiProps = {
    Header,
    MessageList,
    Input,
    Footer,
    messageButtons,
    autoScroll,
    title,
    showCopyButton,
    showFeedbackButtons,
    placeholder,
    popupHidden,
    setPopupHidden,
    theme,
    webComponentProps,
    ...popupProps,
  };

  const popupButtonProps = {
    title: 'Chat with Assistant',
    icon: 'pichat-icon-assistant',
    popupHidden,
    setPopupHidden,
    theme,
    webComponentProps,
  };

  const camelToKebab = (str) => {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  };

  // Don't render until themes are loaded
  if (!themesLoaded) {
    console.log('Themes not loaded', theme);
    return null; // or return a loading spinner/component
  }
  console.log('Themes loaded - rendering', theme);

  return (
    <div
    style={{
      ...Object.entries(theme ? theme : {}).filter(([key]) => key.endsWith('Css')).reduce((acc, [key, value]) => {
        acc[`--${camelToKebab(key.replace('Css', ''))}`] = value;
        return acc;
      }, {}),
    }}>
      <AppContextProvider initialContext={initialContext} allowExternalUpdates={allowExternalUpdates}>
        <ChatProvider {...chatProviderProps}>
          <Popup {...uiProps} />
          <PopupButton {...popupButtonProps} />
        </ChatProvider>
      </AppContextProvider>
    </div>
  );
}

// Mount the app
// const root = document.querySelector('.pichat-chatbot');
// const root = document.getElementById('pichat-chatbot-root');
// if (root) {
//   render(<ChatApp />, root);
// }

class ChatbotComponent extends HTMLElement {
  constructor() {
    super();
    console.log('ChatbotComponent constructor 2');
  }

  kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const root = document.createElement('div');
    root.id = 'pichat-chatbot-root';
    const styles = document.createElement('div');
    const props = {};
    for (let i = 0; i < this.attributes.length; i++) {
      const attribute = this.attributes[i];
      props[this.kebabToCamel(attribute.name)] = attribute.value;
    }
    console.log('ChatbotComponent connectedCallback props', props);
    styles.innerHTML = `
      <link
        rel="stylesheet"
        href="/etc.clientlibs/pichat/clientlibs/clientlib-shared.css"
      />
      <link
        rel="stylesheet"
        href="/etc.clientlibs/pichat/clientlibs/clientlib-chatbot.css"
      />`;
    shadow.appendChild(styles);
    shadow.appendChild(root);
    render(<ChatApp webComponentProps={props} />, root);
  }
}

customElements.define('pichat-chatbot', ChatbotComponent);