import { normalizeCase } from './normalize-case';

/**
 * Converts a string to dot.case.
 *
 * All words are lowercase and separated by dots. Commonly used in
 * configuration keys, namespaces, and object paths.
 *
 * @param input - The string to convert to dot.case
 * @returns The dot.case version of the input string
 *
 * @example
 * ```ts
 * dotCase('hello world') // 'hello.world'
 * dotCase('UserName') // 'user.name'
 * dotCase('user_name') // 'user.name'
 * dotCase('myConfigKey') // 'my.config.key'
 * ```
 */
export function dotCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '.');
}
