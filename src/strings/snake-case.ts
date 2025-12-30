import { normalizeCase } from './normalize-case';

/**
 * Converts a string to snake_case.
 * @example
 * ```ts
 * snakeCase('hello world') // 'hello_world'
 * snakeCase('UserName') // 'user_name'
 * snakeCase('http-response') // 'http_response'
 * ```
 */
export function snakeCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '_');
}
