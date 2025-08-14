export function extractPlaylistId(url) {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)(\?|$)/);
  return match ? match[1] : null;
}
