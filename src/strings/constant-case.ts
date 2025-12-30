import { normalizeCase } from './normalize-case';

/**
 * Converts a string to CONSTANT_CASE (also known as SCREAMING_SNAKE_CASE).
 * @example
 * ```ts
 * constantCase('hello world') // 'HELLO_WORLD'
 * constantCase('UserName') // 'USER_NAME'
 * constantCase('http-response') // 'HTTP_RESPONSE'
 * ```
 */
export function constantCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '_').toUpperCase();
}
