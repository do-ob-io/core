/**
 * Normalize the casing of a string.
 */
export function normalizeCase(str: string) {
  // Normalize the string by inserting spaces before capital letters and replacing underscores/hyphens with spaces
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase or PascalCase to separate words
    .replace(/[_-]+/g, ' ') // snake_case or kebab-case to spaces
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2'); // Separate acronyms followed by a capitalized word
}
