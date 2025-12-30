import { normalizeCase } from './normalize-case';

/**
 * Converts a string to camelCase.
 *
 * The first word is lowercase, and subsequent words have their first letter capitalized
 * with no separators between words.
 *
 * @param input - The string to convert to camelCase
 * @returns The camelCase version of the input string
 *
 * @example
 * ```ts
 * camelCase('hello world') // 'helloWorld'
 * camelCase('user_name') // 'userName'
 * camelCase('HTTP-Response') // 'httpResponse'
 * camelCase('UserName') // 'userName'
 * ```
 */
export function camelCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized
    .replaceAll(/\s+(\w)/g, (_, char) => char.toUpperCase());
}
