import { useState, useEffect } from 'preact/hooks';

/**
 * Hook to fetch and manage chat configuration from a remote endpoint
 * @param {string} configEndpoint - URL to fetch config from (e.g., '/api/config' or full URL)
 * @param {Object} fallbackConfig - Default config to use if fetch fails or while loading
 * @returns {Object} { config, loading, error }
 */
export function useConfig(configEndpoint, fallbackConfig = {}) {
  const [config, setConfig] = useState(fallbackConfig);
  const [loading, setLoading] = useState(!!configEndpoint);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no configEndpoint provided, use fallback config
    if (!configEndpoint) {
      setLoading(false);
      return;
    }

    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(configEndpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Merge fetched config with fallback config (fetched takes precedence)
        setConfig({ ...fallbackConfig, ...data });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching config:', err);
        setError(err);
        setLoading(false);
        // Keep fallback config on error
      }
    };

    fetchConfig();
  }, [configEndpoint]);

  return { config, loading, error };
}
