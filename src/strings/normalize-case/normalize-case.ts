/**
 * Normalizes a string's casing so it can be easily converted to other cases.
 *
 * Converts various casing formats (camelCase, PascalCase, snake_case, kebab-case)
 * into a consistent lowercase space-separated format. This serves as the foundation
 * for all other case conversion utilities.
 *
 * @param text - The string to normalize
 * @returns A lowercase, space-separated version of the input string
 *
 * @example
 * ```ts
 * normalizeCase('helloWorld') // 'hello world'
 * normalizeCase('UserName') // 'user name'
 * normalizeCase('http_response') // 'http response'
 * normalizeCase('my-variable-name') // 'my variable name'
 * normalizeCase('XMLHttpRequest') // 'xml http request'
 * ```
 */
export function normalizeCase(text: string): string {
  return text
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replaceAll(/[_-]/g, ' ')
    .toLowerCase()
    .trim();
}
