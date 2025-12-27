/**
 * Normalizes a string's casing so it can be easily converted to other cases.
 */
export function normalizeCase(text: string) {
  return text
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replaceAll(/[_-]/g, ' ')
    .toLowerCase()
    .trim();
}
