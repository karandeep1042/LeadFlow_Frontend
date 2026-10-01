/**
 * Resolves a document URL to a fully qualified URL.
 * Handles both remote CDN URLs (e.g. Cloudinary) and local backend server paths.
 */
export const getDocumentUrl = (fileUrl) => {
  if (!fileUrl) return '';
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase.replace(/\/$/, '')}/${fileUrl.replace(/^\//, '')}`;
};

/**
 * Safely opens a document in a new browser tab.
 */
export const openDocumentInNewTab = (fileUrl) => {
  const resolved = getDocumentUrl(fileUrl);
  if (resolved) {
    window.open(resolved, '_blank', 'noopener,noreferrer');
  }
};
