import { Button } from '../Button';

/**
 * ChatButton component for chat-level buttons (not message-specific)
 * Extends the base Button component with chat-specific styling
 *
 * @param {Object} props - All props are passed through to Button component
 */
export function ChatButton(props) {
  return <Button {...props} additionalClasses={['pichat-chat-button']} />;
}
