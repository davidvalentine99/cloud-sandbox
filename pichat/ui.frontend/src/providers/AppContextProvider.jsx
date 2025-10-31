import { createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';

const AppContext = createContext(null);

/**
 * Hook to access app context
 * @returns {Object} App context with context data and update functions
 */
export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
}

/**
 * Provider component for app-level context
 * Manages global application state like user info, page context, etc.
 * Can be updated by components or external scripts on the page
 *
 * @param {Object} props
 * @param {Object} [props.initialContext] - Initial context values
 * @param {ReactNode} props.children - Child components
 */
export function AppContextProvider({ initialContext = {}, children }) {
  const [context, setContext] = useState(initialContext);

  /**
   * Update context - merges new values with existing context
   * @param {Object} updates - Object with keys to update
   */
  const updateContext = (updates) => {
    setContext((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  /**
   * Set a specific context key
   * @param {string} key - The key to set
   * @param {*} value - The value to set
   */
  const setContextValue = (key, value) => {
    setContext((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Clear all context (reset to initial)
   */
  const clearContext = () => {
    setContext(initialContext);
  };

  // Expose API to window for external scripts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.chatAppContext = {
        get: () => context,
        update: updateContext,
        set: setContextValue,
        clear: clearContext,
      };
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        delete window.chatAppContext;
      }
    };
  }, [context]);

  const value = {
    context,
    updateContext,
    setContextValue,
    clearContext,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
