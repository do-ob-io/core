import { normalizeCase } from './normalize-case';

/**
 * Converts a string to PascalCase.
 *
 * All words have their first letter capitalized with no separators between words.
 * Also known as UpperCamelCase.
 *
 * @param input - The string to convert to PascalCase
 * @returns The PascalCase version of the input string
 *
 * @example
 * ```ts
 * pascalCase('hello world') // 'HelloWorld'
 * pascalCase('user_name') // 'UserName'
 * pascalCase('http-response') // 'HttpResponse'
 * pascalCase('myClassName') // 'MyClassName'
 * ```
 */
export function pascalCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized
    .replaceAll(/\b\w/g, (char) => char.toUpperCase())
    .replaceAll(/\s+/g, '');
}
