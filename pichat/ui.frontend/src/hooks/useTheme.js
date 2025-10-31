import { useState, useEffect } from 'preact/hooks';

/**
 * Hook for managing theme (light/dark mode)
 * Respects browser preference, localStorage, or falls back to default
 * @param {string} [defaultTheme='light'] - Default theme if no preference
 * @returns {Object} Theme state and toggle function
 */
export function useTheme(defaultTheme = 'light') {
  // Get initial theme from localStorage, browser preference, or default
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      // First check localStorage for user's explicit choice
      const saved = localStorage.getItem('pichat-theme');
      if (saved) return saved;

      // Then check browser/system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return defaultTheme;
  });

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Only auto-update if user hasn't made an explicit choice
    const handleChange = (e) => {
      const saved = localStorage.getItem('pichat-theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Save to localStorage only when explicitly set by user
    localStorage.setItem('pichat-theme', theme);
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme, setTheme };
}
