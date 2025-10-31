import { useLayoutEffect, useRef } from 'preact/hooks';

/**
 * Hook to automatically scroll to user messages and manage spacer height
 *
 * This hook handles two related concerns:
 * 1. Auto-scrolling: When a user sends a message, scrolls to position it at the top of the viewport
 * 2. Spacer management: Maintains a spacer element at the bottom to ensure messages can be scrolled to the top
 *
 * @param {Array} messages - Array of chat messages
 * @param {Object} scrollContainerRef - Ref to the scroll container (.pichat-message-list-wrapper)
 * @param {boolean} [enabled=true] - Whether auto-scroll is enabled
 * @param {Object} [spacerRef] - Optional ref to the spacer element that pushes content up
 */
export function useAutoScroll(messages, scrollContainerRef, enabled = true, spacerRef = null) {
  // Track the previous message count to detect new messages
  const prevMessageCount = useRef(messages.length);
  // Track if this is a reset (new chat)
  const prevFirstMessageId = useRef(messages[0]?.id);
  // Track if last message was streaming
  const wasStreaming = useRef(false);

  useLayoutEffect(() => {
    // Early exit if container not ready
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const messageList = container.querySelector('.pichat-message-list');

    // Exit if message list not found
    if (!messageList) return;

    // Check if this is a chat reset (first message ID changed or message count decreased significantly)
    const isReset =
      messages.length < prevMessageCount.current ||
      (messages[0]?.id !== prevFirstMessageId.current && prevFirstMessageId.current !== undefined);

    if (messages[0]?.id) {
      prevFirstMessageId.current = messages[0].id;
    }

    // Get last message to check streaming state
    const lastMessage = messages[messages.length - 1];
    const isCurrentlyStreaming = lastMessage?.isStreaming || false;

    // Determine when to adjust spacer:
    // 1. When user sends a message (new user message detected)
    // 2. When streaming ends (was streaming, now not streaming)
    const isNewUserMessage = messages.length > prevMessageCount.current && lastMessage?.sender === 'user';

    const isStreamingJustEnded = wasStreaming.current && !isCurrentlyStreaming;

    // === HANDLE NEW USER MESSAGES ===
    if (enabled && isNewUserMessage) {
      const containerHeight = container.clientHeight;

      // 1. Set spacer to full height for scrolling
      if (spacerRef && spacerRef.current) {
        const spacer = spacerRef.current;
        spacer.style.height = `${containerHeight}px`;
        console.log('User message sent - spacer set to full height:', containerHeight);

        // 2. Now scroll after the layout is updated
        setTimeout(() => {
          const messageElements = container.querySelectorAll('.pichat-message');
          const targetElement = messageElements[messages.length - 1];

          if (targetElement) {
            const paddingTop = parseInt(window.getComputedStyle(messageList).paddingTop) || 0;
            const scrollPosition = targetElement.offsetTop - paddingTop;

            console.log('Auto-scroll to user message:', {
              targetOffset: targetElement.offsetTop,
              paddingTop,
              calculatedPosition: scrollPosition,
            });

            container.scrollTo({
              top: scrollPosition,
              behavior: 'smooth',
            });
          }
        }, 500); // 500ms to ensure spacer height is applied
      }
    }

    // === HANDLE STREAMING END ===
    if (enabled && isStreamingJustEnded && spacerRef && spacerRef.current) {
      const containerHeight = container.clientHeight;

      // Find the last user message
      const messageElements = container.querySelectorAll('.pichat-message');
      let lastUserMessageIndex = -1;

      // Find the index of the last user message
      for (let i = messageElements.length - 1; i >= 0; i--) {
        // Check if this is a user message (you might need to check class or data attribute)
        const message = messages[i];
        if (message && message.sender === 'user') {
          lastUserMessageIndex = i;
          break;
        }
      }

      if (lastUserMessageIndex >= 0 && messageElements[lastUserMessageIndex]) {
        const lastUserMessage = messageElements[lastUserMessageIndex];
        const paddingTop = parseInt(window.getComputedStyle(messageList).paddingTop) || 0;

        // Calculate spacer height to keep user message at top
        // Spacer height = container height - (height from user message to end of content)
        const heightFromUserMessageToEnd = messageList.scrollHeight - lastUserMessage.offsetTop + paddingTop;
        const spacerHeight = Math.max(0, containerHeight - heightFromUserMessageToEnd);

        spacerRef.current.style.height = `${spacerHeight}px`;
        console.log('Streaming ended - spacer adjusted:', {
          containerHeight,
          lastUserMessageOffset: lastUserMessage.offsetTop,
          heightFromUserMessageToEnd,
          spacerHeight,
        });
      }
    }

    // === HANDLE DISABLED STATE ===
    if (!enabled && spacerRef && spacerRef.current) {
      const currentHeight = parseInt(spacerRef.current.style.height) || 0;
      if (currentHeight !== 0) {
        spacerRef.current.style.height = '0';
      }
    }

    // Update streaming state for next render
    wasStreaming.current = isCurrentlyStreaming;

    // === HANDLE RESET/NEW CHAT ===
    if (isReset && enabled) {
      console.log('Chat reset detected, scrolling to top');
      setTimeout(() => {
        container.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 50);
      prevMessageCount.current = messages.length;
      return;
    }

    // Update message count for next comparison
    prevMessageCount.current = messages.length;
  }, [messages, enabled]);
}
