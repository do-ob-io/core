import { test, expect } from 'vitest';
import { clmg } from './clmg';

test('clmg', () => {
  expect(clmg('a b c b')).toBe('a b c');
  expect(clmg('a b c')).toBe('a b c');
  expect(clmg('a a a')).toBe('a');
  expect(clmg('a b c a b c')).toBe('a b c');
  expect(clmg('a b c a b c a b c')).toBe('a b c');
});
