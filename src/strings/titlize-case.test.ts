import { describe, it, expect } from 'vitest';

import { titlizeCase } from './titlize-case';

describe('titlizeCase', () => {
  it('should convert a string to title case', () => {
    const input = 'hello world! this is a test.';
    const expected = 'Hello World! This Is A Test.';
    expect(titlizeCase(input)).toBe(expected);
  });

  it('should handle strings with punctuation', () => {
    const input = 'welcome-to the jungle.';
    const expected = 'Welcome To The Jungle.';
    expect(titlizeCase(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    const input = '';
    const expected = '';
    expect(titlizeCase(input)).toBe(expected);
  });

  it('should handle single word strings', () => {
    const input = 'javascript';
    const expected = 'Javascript';
    expect(titlizeCase(input)).toBe(expected);
  });
});
