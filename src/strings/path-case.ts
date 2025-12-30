import { normalizeCase } from './normalize-case';

/**
 * Converts a string to path/case.
 *
 * All words are lowercase and separated by forward slashes. Useful for
 * generating file paths, URL paths, or directory structures.
 *
 * @param input - The string to convert to path/case
 * @returns The path/case version of the input string
 *
 * @example
 * ```ts
 * pathCase('hello world') // 'hello/world'
 * pathCase('UserName') // 'user/name'
 * pathCase('user_name') // 'user/name'
 * pathCase('myFilePath') // 'my/file/path'
 * ```
 */
export function pathCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '/');
}
