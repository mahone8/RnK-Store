export function truncate(text, max = 90) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
