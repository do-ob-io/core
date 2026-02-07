/**
 * Normalizes a path string into a safe, relative form.
 *
 * The result is trimmed, de-duplicated, stripped of query/hash fragments,
 * and cleaned to avoid path traversal and common injection vectors.
 *
 * @param path - The input path to normalize
 * @returns A sanitized, relative path string
 *
 * @example
 * ```ts
 * pathNormalize(' /Foo//bar/./baz?x=1 ') // 'Foo/bar/baz'
 * pathNormalize('C:\\Temp\\file.txt') // 'Temp/file.txt'
 * pathNormalize('../secret') // 'secret'
 * ```
 */
export function pathNormalize(path: string): string {
  if (!path) {
    return '';
  }

  const trimmed = path.trim();

  if (!trimmed) {
    return '';
  }

  const withoutQueryHash = stripQueryHash(trimmed);
  let normalized = withoutQueryHash.replaceAll('\0', '');

  // Decode encoded percent sign to catch double-encoded traversal markers.
  normalized = normalized.replaceAll(/%25/gi, '%');

  // Convert encoded separators and backslashes into forward slashes.
  normalized = normalized.replaceAll(/%2f|%5c/gi, '/');
  normalized = normalized.replaceAll('\\', '/');

  // Remove scheme prefixes (e.g., http:, javascript:) and drive letters.
  normalized = normalized.replace(/^[A-Za-z][A-Za-z0-9+.-]*:/, '');

  // Trim leading slashes to keep it relative.
  normalized = normalized.replace(/^\/+/, '');

  if (!normalized) {
    return '';
  }

  const segments = normalized.split('/');
  const safeSegments: string[] = [];

  for (const segment of segments) {
    const cleaned = segment.trim();

    if (!cleaned) {
      continue;
    }

    const comparable = cleaned.replaceAll(/%2e/gi, '.');

    if (comparable === '.' || comparable === '..') {
      continue;
    }

    safeSegments.push(cleaned);
  }

  return safeSegments.join('/');
}

function stripQueryHash(value: string): string {
  const hashIndex = value.indexOf('#');
  const queryIndex = value.indexOf('?');
  let cutoff = value.length;

  if (hashIndex !== -1 && hashIndex < cutoff) {
    cutoff = hashIndex;
  }

  if (queryIndex !== -1 && queryIndex < cutoff) {
    cutoff = queryIndex;
  }

  return value.slice(0, cutoff).trim();
}
