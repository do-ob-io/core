import { normalizeCase } from './normalize-case';

/**
 * Converts a string to dot.case.
 * @example
 * ```ts
 * dotCase('hello world') // 'hello.world'
 * dotCase('UserName') // 'user.name'
 * dotCase('user_name') // 'user.name'
 * ```
 */
export function dotCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '.');
}
