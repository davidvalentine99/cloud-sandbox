import { Message } from './Message';

export function MessageList({ messages, buttons, scrollRef, spacerRef }) {
  return (
    <div class="pichat-message-list-wrapper" ref={scrollRef}>
      <div class="pichat-message-list">
        {messages.map((message) => {
          // Handle buttons as either a function or an array
          const messageButtons = typeof buttons === 'function' ? buttons(message) : buttons;

          return <Message key={message.id} {...message} buttons={messageButtons} messages={messages} />;
        })}
      </div>
      <div ref={spacerRef} class="pichat-message-spacer" />
    </div>
  );
}
