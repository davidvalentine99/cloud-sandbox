import { createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import { useAppContext } from './AppContextProvider';

const ChatContext = createContext(null);

/**
 * Hook to access chat state and functions
 * @returns {Object} Chat context with messages, handlers, and controllers
 */
export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
}

/**
 * Provider component for chat context - manages all chat state
 * @param {Object} props
 * @param {string} [props.endpoint] - API endpoint URL for chat messages
 * @param {Object} [props.initialMessage] - Initial welcome message
 * @param {boolean} [props.streamInitialMessage=true] - Whether to stream initial message on new chat
 * @param {Function} [props.onSendMessage] - Custom message send handler
 * @param {Function} [props.onThumbUp] - Custom thumb up handler
 * @param {Function} [props.onThumbDown] - Custom thumb down handler
 * @param {ReactNode} props.children - Child components
 * @param {Object} [props.theme] - Theme configuration
 * @param {Object} [props.webComponentProps] - Web component props
 */
export function ChatProvider({
  endpoint,
  initialMessage,
  streamInitialMessage = true,
  onSendMessage: customOnSendMessage,
  onThumbUp: customOnThumbUp,
  onThumbDown: customOnThumbDown,
  children,
  theme,
  webComponentProps,
}) {
  // Use provided endpoint or fall back to environment variable or default
  const ENDPOINT_URL = endpoint || import.meta.env.VITE_ENDPOINT_URL || '/pichat';

  // Access app-level context for template interpolation
  const { context: appContext } = useAppContext();

  // Template helpers
  const getValueAtPath = (obj, path) => {
    if (!obj || !path) return undefined;
    return path
      .split('.')
      .reduce((acc, key) => (acc != null && typeof acc === 'object' && key in acc ? acc[key] : undefined), obj);
  };

  const resolveTemplate = (text, data) => {
    if (typeof text !== 'string') return text;
    return text.replace(/\$\{([^}]+)\}/g, (_, expr) => {
      const value = getValueAtPath(data, expr.trim());
      return value != null ? String(value) : '';
    });
  };

  const defaultInitialMessage = {
    id: '1',
    sender: 'ai',
    name: webComponentProps?.chatbotName || theme?.chatbotName || 'Assistant',
    content:
      webComponentProps?.initialMessage || theme?.initialMessage || "Hello! 👋 Welcome! I'm here to assist you with any questions or tasks you might have. Whether you need help with technical queries, general information, or just want to explore what I can do - I'm ready to help! How can I make your day better today? 😊",
    timestamp: new Date().toISOString(),
  };

  const [messages, setMessages] = useState(() => {
    const base = initialMessage || defaultInitialMessage;
    const resolved = {
      ...base,
      content: resolveTemplate(base.content, appContext),
    };
    return [resolved];
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReader, setCurrentReader] = useState(null);

  // Try to fetch welcome message from server on mount
  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const response = await fetch(`${ENDPOINT_URL}/api/welcome`);
        if (response.ok) {
          const welcomeMessage = await response.json();
          if (!initialMessage) {
            const resolvedWelcome = {
              ...welcomeMessage,
              content: resolveTemplate(welcomeMessage.content, appContext),
            };
            setMessages([resolvedWelcome]);
          }
          setIsConnected(true);
        }
      } catch (error) {
        console.log('Mock server not available, using default welcome message');
        setIsConnected(false);
      }
    };

    fetchWelcomeMessage();
  }, []);
  const [inputValue, setInputValue] = useState('');
  const [feedbackStates, setFeedbackStates] = useState({});

  // Default message handler that calls the mock server
  const defaultHandleSendMessage = async (content) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      name: 'Mike',
      avatar: 'MZ',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsGenerating(true);

    try {
      // Use streaming endpoint if available
      const response = await fetch(`${ENDPOINT_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Read the stream
      const reader = response.body.getReader();
      setCurrentReader(reader); // Store reader for potential cancellation
      const decoder = new TextDecoder();
      let buffer = '';
      let aiMessageId = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              // Handle Haystack StreamingChunk format
              if ('content' in data && 'meta' in data) {
                // This is a Haystack StreamingChunk

                // Check if this is the start of a new message
                if (data.start === true && data.meta.message_id) {
                  aiMessageId = data.meta.message_id;
                  const aiResponse = {
                    id: aiMessageId,
                    sender: 'ai',
                    name: webComponentProps?.chatbotName || theme?.chatbotName || 'Assistant',
                    content: '',
                    status: '',
                    timestamp: data.meta.timestamp || new Date().toISOString(),
                    isStreaming: true,
                  };
                  setMessages((prev) => [...prev, aiResponse]);
                }

                // Handle status updates
                else if (data.meta && data.meta.status && aiMessageId) {
                  setMessages((prev) =>
                    prev.map((msg) => (msg.id === aiMessageId ? { ...msg, status: data.meta.status } : msg))
                  );
                }

                // Handle content chunks
                else if (data.content && aiMessageId) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, content: msg.content + data.content, status: '' }
                        : msg
                    )
                  );
                }

                // Handle completion
                if (data.finish_reason === 'stop' && aiMessageId) {
                  setMessages((prev) =>
                    prev.map((msg) => (msg.id === aiMessageId ? { ...msg, isStreaming: false, status: '' } : msg))
                  );
                  setIsGenerating(false);
                }
              }

              // Fallback for old formats (backwards compatibility)
              else {
                switch (data.type) {
                  // Anthropic format
                  case 'message_start':
                    aiMessageId = data.message.id;
                    const anthropicResponse = {
                      id: aiMessageId,
                      sender: 'ai',
                      name: webComponentProps?.chatbotName || theme?.chatbotName || 'Assistant',
                      content: '',
                      status: '',
                      timestamp: new Date().toISOString(),
                      isStreaming: true,
                    };
                    setMessages((prev) => [...prev, anthropicResponse]);
                    break;

                  case 'content_block_delta':
                    if (aiMessageId && data.delta && data.delta.type === 'text_delta') {
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === aiMessageId
                            ? { ...msg, content: msg.content + data.delta.text, status: '' }
                            : msg
                        )
                      );
                    }
                    break;

                  case 'message_stop':
                    if (aiMessageId) {
                      setMessages((prev) =>
                        prev.map((msg) => (msg.id === aiMessageId ? { ...msg, isStreaming: false, status: '' } : msg))
                      );
                      setIsGenerating(false);
                    }
                    break;

                  // Original simple format
                  case 'start':
                    aiMessageId = data.id;
                    const fallbackResponse = {
                      id: aiMessageId,
                      sender: data.sender,
                      name: data.name,
                      content: '',
                      status: '',
                      timestamp: data.timestamp,
                      isStreaming: true,
                    };
                    setMessages((prev) => [...prev, fallbackResponse]);
                    break;

                  case 'status':
                    if (aiMessageId) {
                      setMessages((prev) =>
                        prev.map((msg) => (msg.id === aiMessageId ? { ...msg, status: data.content } : msg))
                      );
                    }
                    break;

                  case 'chunk':
                    if (aiMessageId) {
                      const delta = data.delta || data.content || '';
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === aiMessageId
                            ? { ...msg, content: msg.content + delta, status: '' }
                            : msg
                        )
                      );
                    }
                    break;

                  case 'complete':
                    if (aiMessageId) {
                      setMessages((prev) =>
                        prev.map((msg) => (msg.id === aiMessageId ? { ...msg, isStreaming: false, status: '' } : msg))
                      );
                      setIsGenerating(false);
                    }
                    break;
                }
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to get AI response:', error);
      }
      setIsGenerating(false);

      // Fallback to a simple error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        name: webComponentProps?.chatbotName || theme?.chatbotName || 'Assistant',
        content: `I apologize, but I'm having trouble connecting to the server right now. Please try again in a moment. (Error: ${error.message})`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = customOnSendMessage || defaultHandleSendMessage;

  // Handle input send
  const handleSend = () => {
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
      setInputValue('');
    }
  };

  // Stop generation function
  const stopGeneration = () => {
    if (currentReader) {
      try {
        currentReader.cancel();
        setCurrentReader(null);
      } catch (error) {
        console.error('Error canceling stream:', error);
      }
    }

    // Mark any streaming messages as complete
    setMessages((prev) => prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg)));
    setIsGenerating(false);
  };

  const copyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log('Message copied to clipboard');
      return true;
    } catch (error) {
      console.error('Failed to copy message:', error);
      return false;
    }
  };

  const toggleThumbsUp = async (messageId, content) => {
    const feedbackKey = `feedback_${messageId}`;
    const currentFeedback = feedbackStates[messageId];

    let newFeedbackType = null;
    if (currentFeedback !== 'thumbs_up') {
      newFeedbackType = 'thumbs_up';

      // Use custom handler if provided, otherwise send to server
      if (customOnThumbUp) {
        try {
          await customOnThumbUp(messageId, content);
        } catch (error) {
          console.error('Failed to handle thumb up:', error);
        }
      } else {
        // Send feedback to server
        try {
          await fetch(`${ENDPOINT_URL}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messageId,
              content,
              type: 'thumbs_up',
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error('Failed to send feedback:', error);
        }
      }

      // Store in localStorage
      localStorage.setItem(
        feedbackKey,
        JSON.stringify({
          type: 'thumbs_up',
          messageId,
          content,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      // Remove feedback
      localStorage.removeItem(feedbackKey);
    }

    setFeedbackStates((prev) => ({
      ...prev,
      [messageId]: newFeedbackType,
    }));

    return { messageId, type: newFeedbackType };
  };

  const toggleThumbsDown = async (messageId, content) => {
    const feedbackKey = `feedback_${messageId}`;
    const currentFeedback = feedbackStates[messageId];

    let newFeedbackType = null;
    if (currentFeedback !== 'thumbs_down') {
      newFeedbackType = 'thumbs_down';

      // Use custom handler if provided, otherwise send to server
      if (customOnThumbDown) {
        try {
          await customOnThumbDown(messageId, content);
        } catch (error) {
          console.error('Failed to handle thumb down:', error);
        }
      } else {
        // Send feedback to server
        try {
          await fetch(`${ENDPOINT_URL}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messageId,
              content,
              type: 'thumbs_down',
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error('Failed to send feedback:', error);
        }
      }

      // Store in localStorage
      localStorage.setItem(
        feedbackKey,
        JSON.stringify({
          type: 'thumbs_down',
          messageId,
          content,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      // Remove feedback
      localStorage.removeItem(feedbackKey);
    }

    setFeedbackStates((prev) => ({
      ...prev,
      [messageId]: newFeedbackType,
    }));

    return { messageId, type: newFeedbackType };
  };

  const getFeedbackType = (messageId) => {
    return feedbackStates[messageId] || null;
  };

  const openFeedback = (messages) => {
    console.log('Opening feedback with messages:', messages);
    // In a real app, this would open a feedback modal or redirect to feedback page
    alert('Thank you for your interest in helping us improve! Feedback form coming soon.');
  };

  // Load feedback states from localStorage on mount
  useEffect(() => {
    const loadedFeedback = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('feedback_')) {
        const messageId = key.replace('feedback_', '');
        const feedback = JSON.parse(localStorage.getItem(key));
        loadedFeedback[messageId] = feedback.type;
      }
    }
    setFeedbackStates(loadedFeedback);
  }, []);

  const chatController = {
    // State
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isConnected,
    isGenerating,

    // Message operations
    copyMessage,
    toggleThumbsUp,
    toggleThumbsDown,
    getFeedbackType,
    openFeedback,

    // Handlers
    handleSendMessage,
    handleSend,
    stopGeneration,

    /**
     * Start a new chat - show initial message with optional streaming effect
     */
    startNewChat: () => {
      console.log('Starting new chat...');
      const newMessage = {
        ...(initialMessage || defaultInitialMessage),
        id: Date.now().toString(), // New ID for the fresh message
        timestamp: new Date().toISOString(),
      };

      setInputValue('');

      if (streamInitialMessage) {
        const fullContent = resolveTemplate(newMessage.content, appContext);

        // Start with empty content and streaming flag
        setMessages([
          {
            ...newMessage,
            content: '',
            isStreaming: true,
          },
        ]);

        // Stream the content word by word
        let currentIndex = 0;
        const words = fullContent.split(' ');
        let currentText = '';

        const streamInterval = setInterval(() => {
          if (currentIndex < words.length) {
            // Add next word with space
            currentText += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
            currentIndex++;

            setMessages([
              {
                ...newMessage,
                content: currentText,
                isStreaming: currentIndex < words.length,
              },
            ]);
          } else {
            // Streaming complete
            clearInterval(streamInterval);
          }
        }, 50); // 50ms per word for natural reading speed
      } else {
        // Show message immediately without streaming
        setMessages([
          {
            ...newMessage,
            content: resolveTemplate(newMessage.content, appContext),
          },
        ]);
      }
    },
  };

  return <ChatContext.Provider value={chatController}>{children}</ChatContext.Provider>;
}
