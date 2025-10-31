import { useRef, useEffect } from 'preact/hooks';

/**
 * PopupButton component - Customizable chat popup button
 * @param {Object} props
 * @param {string} [props.title="Chat with Assistant"] - Button title
 * @param {string} [props.icon=""] - Button icon class
 * @param {boolean} [props.popupHidden=true] - Whether popup is hidden
 * @param {Function} [props.setPopupHidden] - Set popup hidden state
 * @param {Object} [props.theme] - Theme
 * @param {Object} [props.webComponentProps] - Web component props
 */
export function PopupButton({
  title = 'Chat with Assistant',
  icon = 'pichat-icon-assistant',
  popupHidden,
  setPopupHidden,
  theme,
  webComponentProps,
}) {
  const handleClick = () => {
    setPopupHidden(false);
  };

  return (
    <div class="pichat-popup-button" onClick={handleClick}>
      <span class={`pichat-popup-button-icon ${icon}`} />
      <span class="pichat-popup-button-title">{webComponentProps?.popupButtonText || theme?.popupButtonText || title}</span>
    </div>
  );
}
