import { useState, cloneElement } from 'preact/compat';

/**
 * ButtonGroup component that makes all child buttons mutually exclusive
 * When one button is active, others are hidden
 * @param {Object} props
 * @param {Array} props.children - Array of button components
 * @param {string} [props.messageId] - Message ID for tracking (passed to children)
 * @param {string} [props.content] - Message content (passed to children)
 * @param {Function} [props.onActiveChange] - Callback when active button changes
 * @param {string} [props.mode='hideOthers'] - 'hideOthers' to hide inactive buttons or 'showAll' to always show all
 */
export function ButtonGroup({ children, messageId, content, onActiveChange, mode = 'hideOthers', ...otherProps }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleButtonClick = (index, originalOnClick) => {
    return (event) => {
      const wasActive = activeIndex === index;
      const newActiveIndex = wasActive ? null : index;

      setActiveIndex(newActiveIndex);

      // Notify parent of change
      if (onActiveChange) {
        onActiveChange({
          previousIndex: activeIndex,
          currentIndex: newActiveIndex,
          wasActive,
        });
      }

      // Call the original onClick
      if (originalOnClick) {
        return originalOnClick(event);
      }
    };
  };

  return (
    <>
      {children.map((child, index) => {
        // Hide if another button is active (when in hideOthers mode)
        if (mode === 'hideOthers' && activeIndex !== null && activeIndex !== index) {
          return null;
        }

        // Clone the child and wrap its onClick, pass through all props
        // Only override isActive if the child doesn't already have its own isActive prop
        const childProps = {
          ...child.props,
          ...otherProps, // Pass through all other props (like controller, currentMessage, etc.)
          key: child.key || index,
          messageId,
          content,
          onClick: handleButtonClick(index, child.props.onClick),
        };

        // Only manage isActive state if the child doesn't have its own isActive management
        if (child.props.isActive === undefined) {
          childProps.isActive = activeIndex === index;
        }

        return cloneElement(child, childProps);
      })}
    </>
  );
}
