import { normalizeCase } from './normalize-case';

/**
 * Converts a string to CONSTANT_CASE (also known as SCREAMING_SNAKE_CASE).
 *
 * All words are uppercase and separated by underscores. Commonly used for
 * constants, environment variables, and configuration values.
 *
 * @param input - The string to convert to CONSTANT_CASE
 * @returns The CONSTANT_CASE version of the input string
 *
 * @example
 * ```ts
 * constantCase('hello world') // 'HELLO_WORLD'
 * constantCase('UserName') // 'USER_NAME'
 * constantCase('http-response') // 'HTTP_RESPONSE'
 * constantCase('apiKey') // 'API_KEY'
 * ```
 */
export function constantCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '_').toUpperCase();
}
