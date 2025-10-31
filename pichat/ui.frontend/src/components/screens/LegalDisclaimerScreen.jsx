import { Screen } from './Screen';
import { ChatButton } from '../buttons/chat/ChatButton';

/**
 * Legal Disclaimer Screen - displays AI disclaimer and data collection notice
 * Migrated from LegalDisclaimer to use the generic Screen system
 *
 * @param {Object} props
 * @param {Function} props.onClose - Called when user accepts the disclaimer
 * @param {Function} [props.onClosePopup] - Called when X button is clicked
 * @param {Function} [props.onDecline] - Called when user declines (typically closes entire popup)
 * @param {string} [props.disclaimerText] - Custom disclaimer HTML content
 * @param {string} [props.declineButtonText="Decline"] - Decline button label
 * @param {string} [props.acceptButtonText="Accept"] - Accept button label
 */
export function LegalDisclaimerScreen({
  onClose,
  onClosePopup,
  onDecline,
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
}) {
  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    } else {
      // Default behavior: just close the screen
      onClose();
    }
  };

  const handleAccept = () => {
    onClose();
  };

  const footer = (
    <div class="pichat-screen-buttons">
      <ChatButton variant="negative" label={declineButtonText} onClick={handleDecline} />
      <ChatButton variant="primary" label={acceptButtonText} onClick={handleAccept} />
    </div>
  );

  return (
    <Screen title="AI Disclaimer" onClose={handleAccept} onClosePopup={onClosePopup} footer={footer} className="pichat-legal-disclaimer-screen">
      <div class="pichat-screen-text" dangerouslySetInnerHTML={{ __html: disclaimerText }} />
    </Screen>
  );
}
