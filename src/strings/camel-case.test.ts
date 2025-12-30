import { describe, it, expect } from 'vitest';

import { camelCase } from './camel-case';

describe('camelCase', () => {
  it('should convert space-separated words to camelCase', () => {
    expect(camelCase('hello world')).toBe('helloWorld');
    expect(camelCase('user name')).toBe('userName');
  });

  it('should convert snake_case to camelCase', () => {
    expect(camelCase('user_name')).toBe('userName');
    expect(camelCase('first_name_last_name')).toBe('firstNameLastName');
  });

  it('should convert kebab-case to camelCase', () => {
    expect(camelCase('http-response')).toBe('httpResponse');
    expect(camelCase('my-variable-name')).toBe('myVariableName');
  });

  it('should convert PascalCase to camelCase', () => {
    expect(camelCase('UserName')).toBe('userName');
    expect(camelCase('HTTPResponse')).toBe('httpResponse');
  });

  it('should handle empty strings', () => {
    expect(camelCase('')).toBe('');
  });

  it('should handle single word strings', () => {
    expect(camelCase('javascript')).toBe('javascript');
    expect(camelCase('JavaScript')).toBe('javaScript');
  });

  it('should handle strings with multiple capitals', () => {
    expect(camelCase('XMLHttpRequest')).toBe('xmlHttpRequest');
  });
});
