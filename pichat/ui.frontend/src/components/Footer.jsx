import { NewChat } from './buttons/chat/NewChat';
import { Disclaimer } from './buttons/chat/Disclaimer';
import { useScreen } from '../hooks/useScreen';

/**
 * Footer component with customizable left and right content
 * @param {Object} props
 * @param {JSX.Element} [props.leftElement] - Custom element for left side (defaults to NewChat)
 * @param {JSX.Element} [props.rightElement] - Custom element for right side (defaults to Disclaimer)
 */
export function Footer({ leftElement, rightElement }) {
  const { openScreen } = useScreen();

  return (
    <div class="pichat-input-footer">
      {leftElement || <NewChat />}
      {rightElement || <Disclaimer onClick={() => openScreen('legal-disclaimer')} />}
    </div>
  );
}
