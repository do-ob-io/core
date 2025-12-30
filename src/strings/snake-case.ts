import { normalizeCase } from './normalize-case';

/**
 * Converts a string to snake_case.
 *
 * All words are lowercase and separated by underscores. Commonly used in
 * Python, Ruby, and database naming conventions.
 *
 * @param input - The string to convert to snake_case
 * @returns The snake_case version of the input string
 *
 * @example
 * ```ts
 * snakeCase('hello world') // 'hello_world'
 * snakeCase('UserName') // 'user_name'
 * snakeCase('http-response') // 'http_response'
 * snakeCase('myVariableName') // 'my_variable_name'
 * ```
 */
export function snakeCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\s+/g, '_');
}
