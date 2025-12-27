import { normalizeCase } from './normalize-case';

/**
 * Converts a string to title case, capitalizing the first letter of each word.
 */
export function titlizeCase(input: string): string {
  const normalized = normalizeCase(input);
  return normalized.replaceAll(/\b\w/g, (char) => char.toUpperCase());
}
