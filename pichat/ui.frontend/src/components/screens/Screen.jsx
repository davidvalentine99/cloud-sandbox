/**
 * Base Screen component for consistent screen layout
 * Provides common structure: header with back/close buttons, content area, optional footer
 *
 * @param {Object} props
 * @param {string} [props.title] - Screen title displayed in header
 * @param {Function} props.onClose - Callback when back button is clicked (goes back to chat)
 * @param {Function} [props.onClosePopup] - Callback when X button is clicked (closes entire popup)
 * @param {JSX.Element} props.children - Screen content
 * @param {JSX.Element} [props.footer] - Optional footer content (buttons, etc.)
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function Screen({ title, onClose, onClosePopup, children, footer, className = '' }) {
  return (
    <div class={`pichat-screen ${className}`}>
      {title && (
        <div class="pichat-screen-header">
          <button
            class="pichat-icon-button pichat-icon-back"
            onClick={onClose}
            aria-label="Go back"
            title="Go back"
          />
          <h3 class="pichat-screen-title">{title}</h3>
          {onClosePopup && (
            <button
              class="pichat-icon-button pichat-icon-close"
              onClick={onClosePopup}
              aria-label="Close chat"
              title="Close"
            />
          )}
        </div>
      )}
      <div class="pichat-screen-content">{children}</div>
      {footer && <div class="pichat-screen-footer">{footer}</div>}
    </div>
  );
}
