// Extract the Drive file ID from any common share-link format.
export function driveFileId(url) {
  if (!url) return null;
  const m = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  return m ? m[1] : null;
}

// Drive's cleanest embeddable player. autoplay hint via #.
export function drivePreviewUrl(url) {
  const id = driveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}
