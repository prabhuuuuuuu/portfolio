/** Strip the most common markdown syntax so a summary can be derived from a body. */
export function stripMarkdown(input: string) {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function deriveExcerpt(content: string, limit = 190) {
  const text = stripMarkdown(content);
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : limit).trimEnd()}…`;
}

export function estimateReadingTime(content: string) {
  const text = stripMarkdown(content);
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 220));
}
