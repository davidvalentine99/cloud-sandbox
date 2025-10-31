import { forwardRef } from 'preact/compat';

/**
 * Input component with customizable text and stop generation button
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Change handler for input
 * @param {Function} props.onSend - Send handler
 * @param {boolean} [props.isGenerating] - Whether AI is currently generating
 * @param {Function} [props.onStopGeneration] - Stop generation handler
 * @param {string} [props.placeholder="Type a message"] - Input placeholder text
 * @param {string} [props.sendButtonAriaLabel="Send message"] - Aria label for send button
 * @param {string} [props.stopButtonAriaLabel="Stop generation"] - Aria label for stop button
 * @param {preact.ComponentChildren} [props.additionalButtons] - Additional buttons to render before the send button
 * @param {Object} ref - Forwarded ref to input element
 */
export const Input = forwardRef(
  (
    {
      value,
      onChange,
      onSend,
      isGenerating = false,
      onStopGeneration,
      placeholder = 'Type a message',
      sendButtonAriaLabel = 'Send message',
      stopButtonAriaLabel = 'Stop generation',
      additionalButtons,
    },
    ref
  ) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
        e.preventDefault();
        onSend();
        // Keep focus on input after sending
        if (ref && ref.current) {
          ref.current.focus();
        }
      }
    };

    return (
      <div class="pichat-input-container">
        <div class="pichat-input-wrapper">
          <input
            ref={ref}
            type="text"
            class="pichat-input"
            placeholder={isGenerating ? 'AI is typing...' : placeholder}
            value={value}
            onInput={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {isGenerating ? (
            <button
              class="pichat-send-button pichat-action-icon pichat-icon-stop"
              onClick={onStopGeneration}
              aria-label={stopButtonAriaLabel}
            ></button>
          ) : (
            <button
              class="pichat-send-button pichat-action-icon pichat-icon-send"
              onClick={onSend}
              disabled={!value.trim()}
              aria-label={sendButtonAriaLabel}
            ></button>
          )}
          {additionalButtons}
        </div>
      </div>
    );
  }
);
