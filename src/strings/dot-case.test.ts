import { describe, it, expect } from 'vitest';

import { dotCase } from './dot-case';

describe('dotCase', () => {
  it('should convert space-separated words to dot.case', () => {
    expect(dotCase('hello world')).toBe('hello.world');
    expect(dotCase('user name')).toBe('user.name');
  });

  it('should convert snake_case to dot.case', () => {
    expect(dotCase('user_name')).toBe('user.name');
    expect(dotCase('my_variable_name')).toBe('my.variable.name');
  });

  it('should convert kebab-case to dot.case', () => {
    expect(dotCase('http-response')).toBe('http.response');
    expect(dotCase('my-class-name')).toBe('my.class.name');
  });

  it('should convert PascalCase to dot.case', () => {
    expect(dotCase('UserName')).toBe('user.name');
    expect(dotCase('HTTPResponse')).toBe('http.response');
  });

  it('should convert camelCase to dot.case', () => {
    expect(dotCase('userName')).toBe('user.name');
    expect(dotCase('myVariableName')).toBe('my.variable.name');
  });

  it('should handle empty strings', () => {
    expect(dotCase('')).toBe('');
  });

  it('should handle single word strings', () => {
    expect(dotCase('javascript')).toBe('javascript');
  });
});
