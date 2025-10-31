/**
 * MessageFooter component - Container for message buttons
 * @param {Object} props
 * @param {JSX.Element} props.children - Button components to display
 * @param {string} [props.className="pichat-message-buttons"] - Container class name
 */
export function MessageFooter({ children, className = 'pichat-message-buttons' }) {
  return <div class={className}>{children}</div>;
}
