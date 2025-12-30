import { describe, it, expect } from 'vitest';

import { pascalCase } from './pascal-case';

describe('pascalCase', () => {
  it('should convert space-separated words to PascalCase', () => {
    expect(pascalCase('hello world')).toBe('HelloWorld');
    expect(pascalCase('user name')).toBe('UserName');
  });

  it('should convert snake_case to PascalCase', () => {
    expect(pascalCase('user_name')).toBe('UserName');
    expect(pascalCase('first_name_last_name')).toBe('FirstNameLastName');
  });

  it('should convert kebab-case to PascalCase', () => {
    expect(pascalCase('http-response')).toBe('HttpResponse');
    expect(pascalCase('my-class-name')).toBe('MyClassName');
  });

  it('should convert camelCase to PascalCase', () => {
    expect(pascalCase('userName')).toBe('UserName');
    expect(pascalCase('httpResponse')).toBe('HttpResponse');
  });

  it('should handle empty strings', () => {
    expect(pascalCase('')).toBe('');
  });

  it('should handle single word strings', () => {
    expect(pascalCase('javascript')).toBe('Javascript');
    expect(pascalCase('JavaScript')).toBe('JavaScript');
  });

  it('should handle strings with multiple capitals', () => {
    expect(pascalCase('XMLHttpRequest')).toBe('XmlHttpRequest');
  });
});
