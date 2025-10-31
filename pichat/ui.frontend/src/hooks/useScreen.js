import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

/**
 * Context for screen management
 * Provides methods to open and close screens from anywhere in the component tree
 */
export const ScreenContext = createContext({
  openScreen: () => {},
  closeScreen: () => {},
  closePopup: () => {},
  activeScreen: null,
});

/**
 * Hook to access screen management functions
 * @returns {Object} Screen management functions
 * @returns {Function} openScreen - Function to open a screen by ID with optional props
 * @returns {Function} closeScreen - Function to close the active screen
 * @returns {Function} closePopup - Function to close the entire popup
 * @returns {Object|null} activeScreen - Currently active screen object
 */
export function useScreen() {
  const context = useContext(ScreenContext);

  if (!context) {
    console.warn('useScreen must be used within a ScreenContext.Provider');
    return {
      openScreen: () => {},
      closeScreen: () => {},
      closePopup: () => {},
      activeScreen: null,
    };
  }

  return context;
}
