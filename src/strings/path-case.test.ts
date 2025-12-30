import { describe, it, expect } from 'vitest';

import { pathCase } from './path-case';

describe('pathCase', () => {
  it('should convert space-separated words to path/case', () => {
    expect(pathCase('hello world')).toBe('hello/world');
    expect(pathCase('my component')).toBe('my/component');
  });

  it('should convert snake_case to path/case', () => {
    expect(pathCase('user_name')).toBe('user/name');
    expect(pathCase('my_component_name')).toBe('my/component/name');
  });

  it('should convert kebab-case to path/case', () => {
    expect(pathCase('http-response')).toBe('http/response');
    expect(pathCase('my-file-name')).toBe('my/file/name');
  });

  it('should convert PascalCase to path/case', () => {
    expect(pathCase('UserName')).toBe('user/name');
    expect(pathCase('HTTPResponse')).toBe('http/response');
  });

  it('should convert camelCase to path/case', () => {
    expect(pathCase('userName')).toBe('user/name');
    expect(pathCase('myFileName')).toBe('my/file/name');
  });

  it('should handle empty strings', () => {
    expect(pathCase('')).toBe('');
  });

  it('should handle single word strings', () => {
    expect(pathCase('javascript')).toBe('javascript');
  });
});
