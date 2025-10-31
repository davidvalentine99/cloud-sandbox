/**
 * References component for displaying message-related links
 * @param {Object} props
 * @param {Array} props.links - Array of link objects
 * @param {string} props.links[].url - Link URL
 * @param {string} props.links[].text - Link display text
 * @param {string} [props.links[].note] - Optional note about the link
 * @param {string} [props.title="These links may be of interest:"] - Title text for references section
 * @param {boolean} [props.showTitle=true] - Whether to show the title
 * @param {string} [props.className="pichat-message-links"] - CSS class for the container
 * @param {JSX.Element} [props.customContent] - Custom content to replace default rendering
 */
export function References({
  links,
  title = 'These links may be of interest:',
  showTitle = true,
  className = 'pichat-message-links',
  customContent,
}) {
  // Don't render if no links
  if (!links || links.length === 0) {
    return null;
  }

  // Use custom content if provided
  if (customContent) {
    return <div class={className}>{customContent}</div>;
  }

  return (
    <div class={className}>
      {showTitle && <p>{title}</p>}
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.note || link.text}>
              {link.text}
            </a>
            {link.note && <span class="pichat-link-note"> {link.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
