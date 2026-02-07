/**
 * Strips query string and hash fragments from a path string.
 *
 * @param path - The path to trim of query/hash fragments
 * @returns The path without query or hash fragments, trimmed
 *
 * @example
 * ```ts
 * pathStripQueryHash('/assets/bg.webp?x=1#frag') // '/assets/bg.webp'
 * pathStripQueryHash('  /foo/bar#section  ') // '/foo/bar'
 * ```
 */
export function pathStripQueryHash(path: string): string {
  if (!path) {
    return '';
  }

  const hashIndex = path.indexOf('#');
  const queryIndex = path.indexOf('?');
  let cutoff = path.length;

  if (hashIndex !== -1 && hashIndex < cutoff) {
    cutoff = hashIndex;
  }

  if (queryIndex !== -1 && queryIndex < cutoff) {
    cutoff = queryIndex;
  }

  return path.slice(0, cutoff).trim();
}
