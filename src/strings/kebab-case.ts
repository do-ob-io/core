import { normalizeCase } from './normalize-case';

/**
 * Converts a string to kebab-case.
 *
 * All words are lowercase and separated by hyphens. Commonly used in URLs,
 * CSS classes, and HTML attributes.
 *
 * @param input - The string to convert to kebab-case
 * @returns The kebab-case version of the input string
 *
 * @example
 * ```ts
 * kebabCase('hello world') // 'hello-world'
 * kebabCase('UserName') // 'user-name'
 * kebabCase('user_name') // 'user-name'
 * kebabCase('myVariableName') // 'my-variable-name'
 * ```
 */
export function kebabCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '-');
}
