import { describe, it, expect } from 'vitest';

import { kebabCase } from './kebab-case';

describe('kebabCase', () => {
  it('should convert space-separated words to kebab-case', () => {
    expect(kebabCase('hello world')).toBe('hello-world');
    expect(kebabCase('user name')).toBe('user-name');
  });

  it('should convert snake_case to kebab-case', () => {
    expect(kebabCase('user_name')).toBe('user-name');
    expect(kebabCase('my_variable_name')).toBe('my-variable-name');
  });

  it('should convert PascalCase to kebab-case', () => {
    expect(kebabCase('UserName')).toBe('user-name');
    expect(kebabCase('HTTPResponse')).toBe('http-response');
  });

  it('should convert camelCase to kebab-case', () => {
    expect(kebabCase('userName')).toBe('user-name');
    expect(kebabCase('myVariableName')).toBe('my-variable-name');
  });

  it('should handle empty strings', () => {
    expect(kebabCase('')).toBe('');
  });

  it('should handle single word strings', () => {
    expect(kebabCase('javascript')).toBe('javascript');
    expect(kebabCase('JavaScript')).toBe('java-script');
  });

  it('should handle strings with multiple capitals', () => {
    expect(kebabCase('XMLHttpRequest')).toBe('xml-http-request');
  });
});
