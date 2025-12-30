import { normalizeCase } from './normalize-case';

/**
 * Converts a string to kebab-case.
 * @example
 * ```ts
 * kebabCase('hello world') // 'hello-world'
 * kebabCase('UserName') // 'user-name'
 * kebabCase('user_name') // 'user-name'
 * ```
 */
export function kebabCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '-');
}
