import { normalizeCase } from './normalize-case';

/**
 * Converts a string to camelCase.
 * @example
 * ```ts
 * camelCase('hello world') // 'helloWorld'
 * camelCase('user_name') // 'userName'
 * camelCase('HTTP-Response') // 'httpResponse'
 * ```
 */
export function camelCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized
    .replaceAll(/\s+(\w)/g, (_, char) => char.toUpperCase());
}
