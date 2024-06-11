/* eslint-disable tailwindcss/no-custom-classname */
import { test, expect } from 'vitest';
import { clsx } from './clsx';

test('should combine class names', () => {
  expect(clsx('a', 'b', 'c')).toEqual('a b c');
});

test('should ignore non-string arguments', () => {
  expect(clsx('a', 0, 'b', null, 'c')).toEqual('a b c');
});

test('should ignore empty strings', () => {
  expect(clsx('a', '', 'b', '', 'c')).toEqual('a b c');
});
