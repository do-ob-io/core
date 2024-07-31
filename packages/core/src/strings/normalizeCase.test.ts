import { test, expect } from 'vitest';
import { normalizeCase } from './normalizeCase';

test('should normalize the casing of a string', () => {
  expect(normalizeCase('camelCase')).toBe('camel Case');
  expect(normalizeCase('PascalCase')).toBe('Pascal Case');
  expect(normalizeCase('snake_case')).toBe('snake case');
  expect(normalizeCase('kebab-case')).toBe('kebab case');
  expect(normalizeCase('HTTPResponse')).toBe('HTTP Response');
  expect(normalizeCase('HTTPResponseCode')).toBe('HTTP Response Code');
  expect(normalizeCase('HTTPResponseCode200')).toBe('HTTP Response Code200');
});
