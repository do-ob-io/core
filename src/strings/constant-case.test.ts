import { describe, it, expect } from 'vitest';

import { constantCase } from './constant-case';

describe('constantCase', () => {
  it('should convert space-separated words to CONSTANT_CASE', () => {
    expect(constantCase('hello world')).toBe('HELLO_WORLD');
    expect(constantCase('api key')).toBe('API_KEY');
  });

  it('should convert kebab-case to CONSTANT_CASE', () => {
    expect(constantCase('http-response')).toBe('HTTP_RESPONSE');
    expect(constantCase('max-retry-count')).toBe('MAX_RETRY_COUNT');
  });

  it('should convert camelCase to CONSTANT_CASE', () => {
    expect(constantCase('userName')).toBe('USER_NAME');
    expect(constantCase('maxRetryCount')).toBe('MAX_RETRY_COUNT');
  });

  it('should convert PascalCase to CONSTANT_CASE', () => {
    expect(constantCase('UserName')).toBe('USER_NAME');
    expect(constantCase('HTTPResponse')).toBe('HTTP_RESPONSE');
  });

  it('should handle empty strings', () => {
    expect(constantCase('')).toBe('');
  });

  it('should handle single word strings', () => {
    expect(constantCase('javascript')).toBe('JAVASCRIPT');
    expect(constantCase('JavaScript')).toBe('JAVA_SCRIPT');
  });

  it('should handle strings with multiple capitals', () => {
    expect(constantCase('XMLHttpRequest')).toBe('XML_HTTP_REQUEST');
  });
});
