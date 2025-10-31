/**
 * Simple markdown formatter
 * @param {string} text - The markdown text to format
 * @returns {string} HTML formatted text
 */
export function formatMarkdown(text) {
  if (!text) return '';

  let formatted = text
    // Headers - add margin spacing in the tag
    .replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="md-h3">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 class="md-h2">$1</h2>')
    // Bold (handle both ** and __ syntax)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    // Italic (avoid matching list items)
    .replace(/(?<!^|\n|\*)\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/_([^_\n]+)_/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Lists - collect them first
    .replace(/^[*•] (.+)$/gim, '<li>$1</li>')
    .replace(/^- (.+)$/gim, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

  // Wrap consecutive <li> elements in <ul>
  formatted = formatted.replace(/(<li>.*?<\/li>\s*)+/g, (match) => {
    return '<ul class="md-list">' + match + '</ul>';
  });

  // Convert paragraph breaks (double newlines) to <p> tags
  formatted = formatted
    .split(/\n\n+/)
    .map((para) => {
      // Don't wrap if it's already a block element
      if (
        para.trim().startsWith('<h') ||
        para.trim().startsWith('<ul') ||
        para.trim().startsWith('<blockquote') ||
        para.trim().startsWith('<pre')
      ) {
        return para;
      }
      return para.trim() ? `<p>${para}</p>` : '';
    })
    .join('');

  // Handle single line breaks within paragraphs
  formatted = formatted.replace(/\n(?!<)/g, ' ');

  return formatted;
}
