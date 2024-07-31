import { test, expect } from 'vitest';
import { titleCase } from './titleCase';

test('should titlecasify a string', () => {
  expect(titleCase('camelCase')).toBe('Camel Case');
  expect(titleCase('PascalCase')).toBe('Pascal Case');
  expect(titleCase('snake_case')).toBe('Snake Case');
  expect(titleCase('kebab-case')).toBe('Kebab Case');
  expect(titleCase('HTTPResponse')).toBe('HTTP Response');
  expect(titleCase('HTTPResponseCode')).toBe('HTTP Response Code');
  expect(titleCase('HTTPResponseCode200')).toBe('HTTP Response Code200');
});
