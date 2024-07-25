import { test, expect } from 'vitest';
import { fasthash } from './fasthash';

test('should hash a string', () => {
  const hash = fasthash('test');

  expect(hash).toBe(2292920316);
});

test('should hash an empty string', () => {
  const hash = fasthash('');

  expect(hash).toBe(2166136261);
});

test('should hash the same string with the same result', () => {
  const hash1 = fasthash('this is an example');
  const hash2 = fasthash('this is an example');

  expect(hash1).toBe(hash2);
});
