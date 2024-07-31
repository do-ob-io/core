import { normalizeCase } from './normalizeCase';

/**
 * Titlizes a string by capitalizing the first letter of each word and applying spaces between words.
 */
export function titleCase(str: string) {
  return normalizeCase(str).replace(/\b\w/g, (c) => c.toUpperCase());
}
