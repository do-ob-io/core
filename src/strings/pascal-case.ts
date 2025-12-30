import { normalizeCase } from './normalize-case';

/**
 * Converts a string to PascalCase.
 * @example
 * ```ts
 * pascalCase('hello world') // 'HelloWorld'
 * pascalCase('user_name') // 'UserName'
 * pascalCase('http-response') // 'HttpResponse'
 * ```
 */
export function pascalCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized
    .replaceAll(/\b\w/g, (char) => char.toUpperCase())
    .replaceAll(/\s+/g, '');
}
