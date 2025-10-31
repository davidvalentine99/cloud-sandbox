import { useState } from 'preact/hooks';

/**
 * Base Button component that provides common functionality for all buttons
 * @param {Object} props
 * @param {string} props.iconClass - Icon class for the button
 * @param {string} [props.inProgressIconClass] - Icon class to show during button click
 * @param {string} [props.endIconClass] - Icon class to show after button click completes
 * @param {Function} props.onClick - Click handler for the button
 * @param {string} [props.title] - Tooltip/title for the button (also used for aria-label)
 * @param {string} [props.label] - Optional text label to display after the icon
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.isActive=false] - Whether the button is in active state
 * @param {string} [props.tooltipText] - Text to display in tooltip
 * @param {number} [props.tooltipDuration=2000] - Duration to show tooltip in ms (0 or negative to disable)
 * @param {string} [props.baseClass='pichat-button'] - Base CSS class for the button
 * @param {Array} [props.additionalClasses=[]] - Additional CSS classes to always include
 */
export function Button({
  iconClass,
  inProgressIconClass,
  endIconClass,
  onClick,
  title,
  label,
  className = '',
  isActive = false,
  tooltipText,
  tooltipDuration = 2000,
  baseClass = 'pichat-button',
  additionalClasses = [],
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [currentIconClass, setCurrentIconClass] = useState(iconClass);

  const handleClick = () => {
    if (onClick) {
      // Set in-progress state if icon provided
      if (inProgressIconClass) {
        setCurrentIconClass(inProgressIconClass);
      }

      // Execute the button click
      const result = onClick();

      // Handle async button clicks
      if (result && typeof result.then === 'function') {
        result
          .then(() => {
            handleButtonComplete();
          })
          .catch(() => {
            // Reset on error
            setCurrentIconClass(iconClass);
          });
      } else {
        // Sync button click completed
        handleButtonComplete();
      }
    }
  };

  const handleButtonComplete = () => {
    // Switch to end icon and show tooltip
    if (endIconClass) {
      setCurrentIconClass(endIconClass);
    }

    if (tooltipText && tooltipDuration > 0) {
      setTooltipVisible(true);
    }

    // Reset after duration
    const duration = tooltipDuration > 0 ? tooltipDuration : 500;
    setTimeout(() => {
      setTooltipVisible(false);
      setCurrentIconClass(iconClass);
    }, duration);
  };

  const buttonClass = [baseClass, ...additionalClasses, isActive ? 'pichat-active' : '', className]
    .filter(Boolean)
    .join(' ');

  const button = (
    <button class={`${buttonClass} ${currentIconClass}`} onClick={handleClick} title={title} aria-label={title}>
      {label && <span class="pichat-button-label">{label}</span>}
    </button>
  );

  // Always wrap in button-wrapper for consistency
  return (
    <div class="pichat-button-wrapper">
      {button}
      {tooltipVisible && tooltipText && <span class="pichat-tooltip pichat-tooltip-top">{tooltipText}</span>}
    </div>
  );
}
