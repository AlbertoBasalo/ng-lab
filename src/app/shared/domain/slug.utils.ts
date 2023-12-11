/**
 * Gets a slug from any text
 * @description A slug is a string that is safe to use in a URL.
 * @param text The text to convert to a slug
 * @returns The safe slug to use in a URL
 */
export function slugify(text?: string) {
  if (!text) return '';
  return text.toLowerCase().replace(/\s/g, '-');
}
