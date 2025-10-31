import { useState } from "preact/hooks";

/**
 * Header component with customizable title and buttons
 * @param {Object} props
 * @param {boolean} [props.showBackButton=true] - Whether to show the default back button
 * @param {JSX.Element} [props.beforeTitle] - Content to render before the title
 * @param {string} [props.title] - Plain text title (rendered as h3)
 * @param {JSX.Element} [props.titleElement] - Custom JSX for title (overrides title prop)
 * @param {JSX.Element} [props.afterTitle] - Content to render after the title
 * @param {JSX.Element} [props.backButton] - Custom back button element (overrides default)
 * @param {Function} [props.backButtonAction] - Click handler for the back button
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button
 * @param {Function} [props.closeButtonAction] - Click handler for the close button
 * @param {string} [props.theme] - Current theme ('light' or 'dark')
 */
export function Header({
  showBackButton = true,
  beforeTitle,
  title,
  titleElement,
  afterTitle,
  backButton,
  backButtonAction,
  showCloseButton = true,
  closeButtonAction,
}) {
  const shouldShowBackButton = backButton || showBackButton;

  return (
    <header class="pichat-header">
      {backButton
        ? backButton
        : showBackButton && (
            <button
              class="pichat-icon-button pichat-nav-icon pichat-icon-back"
              aria-label="Go back"
              onClick={backButtonAction}
            ></button>
          )}
      {beforeTitle}
      {titleElement ? titleElement : title && <h3 class="pichat-title">{title}</h3>}
      {afterTitle}
      {showCloseButton && (
        <button
          class="pichat-icon-button pichat-nav-icon pichat-icon-close"
          aria-label="Close chat"
          onClick={closeButtonAction}
        ></button>
      )}
    </header>
  );
}
