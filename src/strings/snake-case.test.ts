import { describe, it, expect } from 'vitest';

import { snakeCase } from './snake-case';

describe('snakeCase', () => {
  it('should convert space-separated words to snake_case', () => {
    expect(snakeCase('hello world')).toBe('hello_world');
    expect(snakeCase('user name')).toBe('user_name');
  });

  it('should convert kebab-case to snake_case', () => {
    expect(snakeCase('http-response')).toBe('http_response');
    expect(snakeCase('my-variable-name')).toBe('my_variable_name');
  });

  it('should convert PascalCase to snake_case', () => {
    expect(snakeCase('UserName')).toBe('user_name');
    expect(snakeCase('HTTPResponse')).toBe('http_response');
  });

  it('should convert camelCase to snake_case', () => {
    expect(snakeCase('userName')).toBe('user_name');
    expect(snakeCase('myVariableName')).toBe('my_variable_name');
  });

  it('should handle empty strings', () => {
    expect(snakeCase('')).toBe('');
  });

  it('should handle single word strings', () => {
    expect(snakeCase('javascript')).toBe('javascript');
    expect(snakeCase('JavaScript')).toBe('java_script');
  });

  it('should handle strings with multiple capitals', () => {
    expect(snakeCase('XMLHttpRequest')).toBe('xml_http_request');
  });
});
