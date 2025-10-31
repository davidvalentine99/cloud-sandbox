import { Button } from './Button';
import { useScreen } from '../../hooks/useScreen';

/**
 * Generic button component to trigger any screen
 * Can be used in message footers, chat footer, or anywhere in the chat interface
 *
 * @param {Object} props
 * @param {string} props.screenId - ID of the screen to open
 * @param {Object} [props.screenProps] - Props to pass to the screen component
 * @param {string} [props.label] - Button label text
 * @param {string} [props.icon] - Icon class name
 * @param {string} [props.title] - Tooltip text
 * @param {string} [props.baseClass='pichat-button'] - Base CSS class
 * @param {string} [props.iconClass] - Icon CSS class (alternative to icon)
 */
export function ScreenButton({
  screenId,
  screenProps = {},
  label,
  icon,
  title,
  baseClass = 'pichat-button',
  iconClass,
  ...rest
}) {
  const { openScreen } = useScreen();

  const handleClick = () => {
    openScreen(screenId, screenProps);
  };

  return (
    <Button
      onClick={handleClick}
      label={label}
      iconClass={iconClass || icon}
      title={title || label}
      baseClass={baseClass}
      {...rest}
    />
  );
}
