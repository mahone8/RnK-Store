// Product images can be either a full external URL (e.g. the seeded
// Unsplash photos) or a local upload path like "/uploads/xyz.jpg" served
// by the backend. This resolves the local ones to a full URL so <img>
// tags work regardless of which origin the frontend is served from.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export function resolveImage(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url}`;
}
