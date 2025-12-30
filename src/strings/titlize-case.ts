import { normalizeCase } from './normalize-case';

/**
 * Converts a string to Title Case, capitalizing the first letter of each word.
 *
 * All words retain their spacing and have their first letter capitalized,
 * regardless of the original casing. Commonly used for headings, titles,
 * and proper nouns.
 *
 * @param input - The string to convert to Title Case
 * @returns The Title Case version of the input string
 *
 * @example
 * ```ts
 * titlizeCase('hello world') // 'Hello World'
 * titlizeCase('user_name') // 'User Name'
 * titlizeCase('http-response') // 'Http Response'
 * titlizeCase('myVariableName') // 'My Variable Name'
 * ```
 */
export function titlizeCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\b\w/g, (char) => char.toUpperCase());
}
