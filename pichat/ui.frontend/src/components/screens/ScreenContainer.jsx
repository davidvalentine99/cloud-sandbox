import { useState, Suspense } from 'preact/compat';
import { ScreenContext } from '../../hooks/useScreen';

/**
 * ScreenContainer manages screen state and provides context for opening/closing screens
 * Acts as the single source of truth for which screen is currently active
 *
 * @param {Object} props
 * @param {Array} props.screens - Array of screen configurations: [{ id: string, component: Component }]
 * @param {Function} [props.onClosePopup] - Callback to close the entire popup
 * @param {Array} [props.messages] - Messages from ChatProvider to pass to screens
 * @param {Function} [props.setMessages] - Function to update messages from ChatProvider
 * @param {JSX.Element} props.children - Child components that can access the screen context
 */
export function ScreenContainer({ screens = [], onClosePopup, messages, setMessages, children }) {
  const [activeScreen, setActiveScreen] = useState(null);

  /**
   * Open a screen by ID
   * @param {string} id - Screen ID to open
   * @param {Object} props - Props to pass to the screen component
   */
  const openScreen = (id, props = {}) => {
    const screen = screens.find((s) => s.id === id);
    if (screen) {
      setActiveScreen({ ...screen, props });
    } else {
      console.warn(`Screen with id "${id}" not found`);
    }
  };

  /**
   * Close the currently active screen
   */
  const closeScreen = () => {
    setActiveScreen(null);
  };

  /**
   * Close the entire popup
   */
  const closePopup = () => {
    if (onClosePopup) {
      onClosePopup();
    }
  };

  const contextValue = {
    openScreen,
    closeScreen,
    closePopup,
    activeScreen,
  };

  return (
    <ScreenContext.Provider value={contextValue}>
      {children}
      {activeScreen && (
        <Suspense fallback={<div class="pichat-screen-loading">Loading...</div>}>
          <activeScreen.component
            onClose={closeScreen}
            onClosePopup={closePopup}
            messages={messages}
            setMessages={setMessages}
            {...activeScreen.props}
          />
        </Suspense>
      )}
    </ScreenContext.Provider>
  );
}
