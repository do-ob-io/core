import { pathNormalize } from '../path-normalize/path-normalize.js';

/**
 * Checks whether a path ends with one of the provided file extensions.
 *
 * The path is normalized before checking to ensure consistent handling
 * of query strings, hashes, and path separators.
 *
 * @param path - The path to inspect
 * @param extension - The extension or list of extensions to match
 * @returns True when the path ends with one of the extensions
 *
 * @example
 * ```ts
 * pathHasFileExtension('/assets/scene.webp', 'webp') // true
 * pathHasFileExtension('video.MP4?x=1', [ 'webm', '.mp4' ]) // true
 * pathHasFileExtension('/assets/readme', 'md') // false
 * ```
 */
export function pathHasFileExtension(
  path: string,
  extension: string | string[],
): boolean {
  const normalized = pathNormalize(path);

  if (!normalized) {
    return false;
  }

  const extensions = Array.isArray(extension) ? extension : [ extension ];
  const normalizedExtensions = extensions
    .map((item) => item.trim().replace(/^\./, '').toLowerCase())
    .filter(Boolean);

  if (normalizedExtensions.length === 0) {
    return false;
  }

  const lastSegment = normalized.split('/').at(-1) ?? '';
  const dotIndex = lastSegment.lastIndexOf('.');

  if (dotIndex <= 0 || dotIndex === lastSegment.length - 1) {
    return false;
  }

  const fileExtension = lastSegment.slice(dotIndex + 1).toLowerCase();

  return normalizedExtensions.includes(fileExtension);
}
