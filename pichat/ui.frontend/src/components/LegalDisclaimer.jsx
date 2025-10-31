import { useState } from 'preact/hooks';
import { ChatButton } from './buttons/chat/ChatButton';

/**
 * Legal Disclaimer component
 * @param {Object} props
 * @param {string} [props.title="AI Disclaimer"] - Disclaimer title
 * @param {string} [props.disclaimerText] - Custom disclaimer text HTML
 * @param {string} [props.declineButtonText="Decline"] - Decline button text
 * @param {string} [props.acceptButtonText="Accept"] - Accept button text
 */
export function LegalDisclaimer({
  onClick,
  title = 'AI Disclaimer',
  disclaimerText = `
    <p>The AI navigator tool is a tool that uses artificial intelligence. It may contain errors or inaccuracies and is intended to provide general information. While we strive to deliver accurate and reliable content, it may not always reflect the latest developments or expert opinions. It does not overrule or supersede any product-specific Documentation and/or professional advice.</p>
    <p>When you use this tool, we automatically collect information about you, including:</p>
    <ul>
    <li>Conversation log</li>
    <li>Information collected by cookies and other tracking technologies.</li>
    </ul>
    <p>We use the information to provide, maintain and improve our services and responses for marketing purposes. It should not be used for any other purpose. The information will be protected as established in our data privacy policy. Timeline of keeping information is 90 days.</p>`,
  declineButtonText = 'Decline',
  acceptButtonText = 'Accept',
  setPopupHidden,
  disclaimerHidden,
  setDisclaimerHidden,
}) {
  const declineButtonClick = () => {
    setPopupHidden(true);
  };

  const acceptButtonClick = () => {
    setDisclaimerHidden(true);
  };

  return (
    <div class={`pichat-legal-disclaimer ${disclaimerHidden ? 'pichat-legal-disclaimer__hidden' : ''}`}>
      <div class="pichat-legal-disclaimer-content">
        <div class="pichat-legal-disclaimer-text" dangerouslySetInnerHTML={{ __html: disclaimerText }}></div>
        <div class="pichat-legal-disclaimer-buttons">
          <ChatButton variant="negative" label={declineButtonText} onClick={declineButtonClick} />
          <ChatButton variant="primary" label={acceptButtonText} onClick={acceptButtonClick} />
        </div>
      </div>
    </div>
  );
}
