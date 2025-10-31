import { Button } from '../Button';

/**
 * MessageButton component for message-specific buttons
 * Extends the base Button component with message-specific styling
 *
 * @param {Object} props
 * @param {string} props.iconClass - Icon class for the button (e.g., 'pichat-icon-copy')
 * @param {string} [props.inProgressIconClass] - Icon class to show during action
 * @param {string} [props.endIconClass] - Icon class to show after action completes
 * @param {Function} props.onClick - Click handler for the button
 * @param {string} [props.title] - Tooltip/title for the button (also used for aria-label)
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.isActive=false] - Whether the action is in active state
 * @param {string} [props.tooltipText] - Text to display in tooltip
 * @param {number} [props.tooltipDuration=2000] - Duration to show tooltip in ms (0 or negative to disable)
 */
export function MessageButton(props) {
  return <Button {...props} additionalClasses={['pichat-message-button', 'pichat-message-action-icon']} />;
}
