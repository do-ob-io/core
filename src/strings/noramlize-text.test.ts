import { describe, it, expect } from 'vitest';

import { normalizeCase } from './normalize-case.js';

describe('normalizeCase', () => {
  it('should normalize camelCase', () => {
    expect(normalizeCase('camelCaseString')).toBe('camel case string');
  });

  it('should normalize PascalCase', () => {
    expect(normalizeCase('PascalCaseString')).toBe('pascal case string');
  });

  it('should normalize snake_case', () => {
    expect(normalizeCase('snake_case_string')).toBe('snake case string');
  });

  it('should normalize kebab-case', () => {
    expect(normalizeCase('kebab-case-string')).toBe('kebab case string');
  });

  it('should handle mixed cases', () => {
    expect(normalizeCase('mixedCASE_string-Example')).toBe('mixed case string example');
  });

  it('should trim leading and trailing spaces', () => {
    expect(normalizeCase('   leadingAndTrailingSpaces   ')).toBe('leading and trailing spaces');
  });
});
