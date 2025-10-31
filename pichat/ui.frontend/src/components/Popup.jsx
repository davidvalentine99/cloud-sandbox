import { useRef, useEffect } from 'preact/hooks';
import { Header } from './Header';
import { MessageList } from './MessageList';
import { Input } from './Input';
import { VoiceEnabledInput } from './VoiceEnabledInput';
import { Footer } from './Footer';
import { ScreenContainer } from './screens/ScreenContainer';
import { LegalDisclaimerScreen } from './screens/LegalDisclaimerScreen';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useChat } from '../providers/ChatProvider';
import { useTheme } from '../hooks/useTheme';
import { CopyMessage } from './buttons/message/CopyMessage';
import { ThumbsUp } from './buttons/message/ThumbsUp';
import { ThumbsDown } from './buttons/message/ThumbsDown';
import { ButtonGroup } from './buttons/ButtonGroup';

/**
 * Popup component - Customizable chat popup
 * @param {Object} props
 * @param {JSX.Element} [props.Header] - Custom header component
 * @param {JSX.Element} [props.MessageList] - Custom message list component
 * @param {JSX.Element} [props.Input] - Custom input component
 * @param {JSX.Element} [props.Footer] - Custom footer component
 * @param {Object} [props.theme] - Theme
 * @param {Array} [props.screens] - Screen configurations: [{ id, component }]
 * @param {Array} [props.messageButtons] - Custom message button components
 * @param {boolean} [props.autoScroll=true] - Whether to auto-scroll to user messages
 * @param {string} [props.title="Chat with Assistant"] - Window title
 * @param {boolean} [props.showCopyButton=true] - Whether to show copy button
 * @param {boolean} [props.showFeedbackButtons=true] - Whether to show feedback buttons
 * @param {string} [props.placeholder="Type a message"] - Input placeholder text
 * @param {string} [props.positionClass="pichat-popup__bottom-popup"] - Position class
 * @param {boolean} [props.popupHidden=true] - Whether popup is hidden
 * @param {Function} [props.setPopupHidden] - Set popup hidden state
 * @param {Object} [props.webComponentProps] - Web component props
 */
export function Popup({
  Header: CustomHeader,
  MessageList: CustomMessageList,
  Input: CustomInput,
  Footer: CustomFooter,
  theme,
  screens,
  messageButtons: customMessageButtons,
  autoScroll = true,
  title = 'Chat with Assistant',
  showCopyButton = true,
  showFeedbackButtons = true,
  placeholder = 'Type a message',
  positionClass = 'pichat-popup__bottom-popup',
  popupHidden = true,
  setPopupHidden,
  webComponentProps,
}) {
  const messageListRef = useRef(null);
  const spacerRef = useRef(null);
  const inputRef = useRef(null);
  const { messages, inputValue, setInputValue, handleSend, isGenerating, stopGeneration } = useChat();
  // const { theme, toggleTheme } = useTheme();

  // Keep input focused at all times when not generating
  useEffect(() => {
    if (!isGenerating && inputRef.current && document.activeElement !== inputRef.current) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        if (inputRef.current && typeof inputRef.current.focus === 'function') {
          inputRef.current.focus();
        }
      }, 50);
    }
  }, [isGenerating, messages]);

  // Default message buttons
  const defaultMessageButtons = [];

  if (showCopyButton) {
    defaultMessageButtons.push(<CopyMessage key="copy" />);
  }

  if (showFeedbackButtons) {
    defaultMessageButtons.push(
      <ButtonGroup key="feedback">
        <ThumbsUp />
        <ThumbsDown />
      </ButtonGroup>
    );
  }

  const messageButtons = customMessageButtons || defaultMessageButtons;

  // Use auto-scroll hook (manages spacer and scroll position)
  useAutoScroll(messages, messageListRef, autoScroll, spacerRef);

  // Use custom components if provided, otherwise use defaults
  const HeaderComponent = CustomHeader || (
    <Header
      title={webComponentProps?.title || theme?.title || title}
      showBackButton={false}
      theme={theme}
      closeButtonAction={() => setPopupHidden(true)}
    />
  );

  const MessageListComponent = CustomMessageList || (
    <MessageList scrollRef={messageListRef} spacerRef={spacerRef} messages={messages} buttons={messageButtons} />
  );

  const InputComponent = CustomInput ? (
    <CustomInput
      ref={inputRef}
      value={inputValue}
      onChange={setInputValue}
      onSend={handleSend}
      isGenerating={isGenerating}
      onStopGeneration={stopGeneration}
      placeholder={webComponentProps?.placeholderText || theme?.placeholderText || placeholder}
    />
  ) : (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={setInputValue}
      onSend={handleSend}
      isGenerating={isGenerating}
      onStopGeneration={stopGeneration}
      placeholder={webComponentProps?.placeholderText || theme?.placeholderText || placeholder}
    />
  );

  // Default screens: legal disclaimer with setPopupHidden for decline action
  const defaultScreens = [
    {
      id: 'legal-disclaimer',
      component: LegalDisclaimerScreen,
    },
  ];

  const allScreens = (screens || defaultScreens).map((screen) => {
    // If it's the legal disclaimer, wrap it to pass setPopupHidden
    if (screen.id === 'legal-disclaimer') {
      return {
        ...screen,
        component: (props) => (
          <LegalDisclaimerScreen {...props} onDecline={() => setPopupHidden(true)} />
        ),
      };
    }
    return screen;
  });

  return (
    <div class={`pichat-popup ${popupHidden ? 'pichat-popup__hidden' : ''} ${positionClass}`}
    >
      <ScreenContainer
        screens={allScreens}
        onClosePopup={() => setPopupHidden(true)}
        messages={messages}
        setMessages={useChat().setMessages}
      >
        <div class="pichat-popup-wrapper">
          {HeaderComponent}
          <div class="pichat-popup-content">
            {MessageListComponent}
            {InputComponent}
            {CustomFooter || <Footer />}
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
}
