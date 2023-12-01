export function slugify(text?: string) {
  if (!text) return '';
  return text.toLowerCase().replace(/\s/g, '-');
}
