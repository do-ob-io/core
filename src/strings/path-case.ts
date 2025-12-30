import { normalizeCase } from './normalize-case';

/**
 * Converts a string to path/case.
 * @example
 * ```ts
 * pathCase('hello world') // 'hello/world'
 * pathCase('UserName') // 'user/name'
 * pathCase('user_name') // 'user/name'
 * ```
 */
export function pathCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '/');
}
